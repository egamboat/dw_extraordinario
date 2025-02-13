import * as THREE from 'three';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { WorldInHandControls } from '@world-in-hand-controls/threejs-world-in-hand';
import { InstancingMethod, SceneManager } from './SceneManager.ts';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export class RenderingManager {
	protected updateRequested: boolean;
	protected div: HTMLElement;
	protected renderer: THREE.WebGLRenderer;
	readonly camera: THREE.PerspectiveCamera;

	protected multisampledRenderTarget: THREE.WebGLRenderTarget;
	protected simpleRenderTarget: THREE.WebGLRenderTarget;
	protected copyScene: THREE.Scene;
	protected copyMaterial: THREE.ShaderMaterial;

	readonly sceneManager: SceneManager;

	readonly controls!: WorldInHandControls;

	protected benchmarkResults: string;

	constructor() {
		this.benchmarkResults = '';

		this.updateRequested = false;
		this.div = document.getElementById('root') as HTMLElement;

		this.renderer = new THREE.WebGLRenderer({ antialias: false });
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setSize(this.div.clientWidth, this.div.clientHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.getContext().getExtension('EXT_float_blend');

		this.div.appendChild(this.renderer.domElement);

		this.camera = new THREE.PerspectiveCamera(75, this.div.clientWidth / this.div.clientHeight, 0.01, 20);
		this.camera.position.set(0, 0.5, 1.35);

		this.sceneManager = new SceneManager(this);

		this.controls = new WorldInHandControls(this.camera, this.renderer.domElement, this.renderer, this.sceneManager.scene, false, 4);
		this.controls.allowRotationBelowGroundPlane = false;
		this.controls.useBottomOfBoundingBoxAsGroundPlane = false;

		const size = this.renderer.getSize(new THREE.Vector2()).multiplyScalar(this.renderer.getPixelRatio());
		this.multisampledRenderTarget = new THREE.WebGLRenderTarget(size.x, size.y, { count: 2, format: THREE.RGBAFormat, type: THREE.FloatType, samples: 4 });
		// The controls need a correct depth texture. By sharing the texture created by the WorldInHandControls, rendering to this.renderTarget also renders to this depth texture.
		this.multisampledRenderTarget.depthTexture = this.controls.navigationRenderTarget.depthTexture;
		this.simpleRenderTarget = new THREE.WebGLRenderTarget(size.x, size.y, { format: THREE.RGBAFormat, type: THREE.FloatType });
		this.simpleRenderTarget.texture.dispose();
		this.simpleRenderTarget.texture = this.multisampledRenderTarget.textures[1];
		// This probably sets up the framebuffer internally. Either way, this is necessary to later read from this render target.
		this.renderer.setRenderTarget(this.simpleRenderTarget);

		const copyVertexShader = `
			varying vec2 vUV;
			
			void main() {
				vUV = uv;
				gl_Position = vec4(position, 1.0);
			}
			`;

		const copyFragmentShader = `
			varying vec2 vUV;
			uniform sampler2D uColorTexture;
			
			void main() {
				gl_FragColor = LinearTosRGB(texture(uColorTexture, vUV));
			}
			`;

		this.copyScene = new THREE.Scene();
		this.copyMaterial = new THREE.ShaderMaterial();
		this.copyMaterial.vertexShader = copyVertexShader;
		this.copyMaterial.fragmentShader = copyFragmentShader;
		const copyPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.copyMaterial);
		copyPlane.frustumCulled = false;

		this.copyScene.add(copyPlane);

		this.startRendering();
	}

	protected startRendering() {
		this.requestUpdate();

		this.controls.addEventListener('change', () => this.requestUpdate());

		window.addEventListener('resize', () => {
			this.renderer.setSize(this.div.clientWidth, this.div.clientHeight);
			this.camera.aspect = this.div.clientWidth / this.div.clientHeight;
			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.camera.updateProjectionMatrix();

			const size = this.renderer.getSize(new THREE.Vector2()).multiplyScalar(this.renderer.getPixelRatio());
			this.multisampledRenderTarget.setSize(size.x, size.y);
			this.simpleRenderTarget.setSize(size.x, size.y);
			this.renderer.setRenderTarget(this.simpleRenderTarget);

			//@ts-expect-error three.js type definitions seem to be broken, this works.
			this.sceneManager.scene.dispatchEvent({ type: 'resize' });

			this.requestUpdate();
		});
	}

	// Helpers

	public requestUpdate() {
		if (this.updateRequested) return;

		this.updateRequested = true;

		// lambda to preserve 'this'
		requestAnimationFrame(() => this.render());
	}

	protected render() {
		this.updateRequested = false;

		if (this.sceneManager.mappings?.instancingMethod !== InstancingMethod.None) {
			const quadTree = this.sceneManager.glyphQuadTree;
			if (quadTree !== undefined && this.sceneManager.mappings !== undefined) {
				quadTree.updateVisibility(this.camera.position, this.sceneManager.mappings.lodThreshold);
			}
		}

		if (this.sceneManager.mappings?.instancingMethod === InstancingMethod.None || this.sceneManager.mappings?.instancingMethod === InstancingMethod.InstancedMesh) {
			this.renderer.setRenderTarget(this.controls.navigationRenderTarget);
			this.renderer.render(this.sceneManager.scene, this.camera);
			this.controls.update(true);
		} else {
			this.renderer.setRenderTarget(this.multisampledRenderTarget);
			this.renderer.render(this.sceneManager.scene, this.camera);

			this.copyRenderTargetToCanvas(this.multisampledRenderTarget);

			this.controls.update(false);
		}
	}

	public addGridLabels() {
		const scene = this.sceneManager.scene;
		const minX = this.sceneManager.minX;
		const maxX = this.sceneManager.maxX;
		const minY = this.sceneManager.minY;
		const maxY = this.sceneManager.maxY;

		const rangeX = maxX - minX;
		const rangeY = maxY - minY;

		const stepX = this.getStepSize(rangeX);
		const stepY = this.getStepSize(rangeY);

		const fontLoader = new FontLoader();

		fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
			const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
			const textSize = rangeX > 1000 ? 0.15 : rangeX > 100 ? 0.1 : 0.05;

			for (let x = Math.ceil(minX / stepX) * stepX; x <= maxX; x += stepX) {
				const textGeometry = new TextGeometry(x.toFixed(0), { font, size: textSize, height: 0.02 });
				const textMesh = new THREE.Mesh(textGeometry, textMaterial);
				textMesh.position.set(x, minY - (textSize * 2), 0);
				scene.add(textMesh);
			}

			for (let y = Math.ceil(minY / stepY) * stepY; y <= maxY; y += stepY) {
				const textGeometry = new TextGeometry(y.toFixed(0), { font, size: textSize, height: 0.02 });
				const textMesh = new THREE.Mesh(textGeometry, textMaterial);
				textMesh.position.set(minX - (textSize * 2), y, 0);
				scene.add(textMesh);
			}
		});
	}

	// 🔹 Función para determinar el tamaño de paso según el rango de valores
	private getStepSize(range: number): number {
		if (range > 1000) return 100;  // Si el rango es grande, mostrar solo miles o centenas
		if (range > 100) return 10;    // Si es mediano, mostrar cada 10
		return 1;                      // Si es pequeño, mostrar cada 1
	}

	public resetCamera(): void {
		this.controls.reset();
	}

	/**
	 * Read the id at the position specified in NDC. x and y are clamped to [-1, 1].
	 * @param x
	 * @param y
	 */
	public getIdFromPixel(x: number, y: number): number | null {
		const width = this.simpleRenderTarget.width;
		const height = this.simpleRenderTarget.height;

		x = Math.max(Math.min(1, x), -1);
		y = Math.max(Math.min(1, y), -1);

		const xPixel = (x * width / 2 + width / 2) - 1;
		const yPixel = (y * height / 2 + height / 2) - 1;

		const pixels = new Float32Array(4 * 9);
		this.renderer.readRenderTargetPixels(this.simpleRenderTarget, xPixel, yPixel, 3, 3, pixels);

		let isEqual = true;

		/*
		Due to MSAA, the value returned is possibly interpolated between multiple glyphs or between a glyph and the background.
		The code below is an attempt to ensure a correct value is read as there is no easy way to tell if the value 125 is correct
		or the result of interpolation between the background (0) and glyph number 250.

		Additionally, different GPU drivers seem to produce different results when reading from this multisampled RenderTarget.
		On Nvidia, this may read 195.00001525878906, 194.99998474121094 and 195 for the same ID value without interpolation with
		the background. As such, we check if the deviation between adjacent pixels is small enough to be considered equal.
		Larger thresholds can be risky, as glyphs with ids 194 and 195 could technically be placed next to each other so that
		interpolation between their ids will occur.
		 */
		for (let i = 4; i < pixels.length; i += 4) if (Math.abs(pixels[i] - pixels[0]) > 0.001) {
			isEqual = false;
			break;
		}

		if (isEqual && pixels[0] !== 0) return Math.round(pixels[0]);
		else return null;
	}

	public get canvas(): HTMLCanvasElement {
		return this.renderer.domElement;
	}

	protected copyRenderTargetToCanvas(renderTarget: THREE.WebGLRenderTarget): void {
		this.copyMaterial.uniforms = { uColorTexture: { value: renderTarget.textures[0] } };
		this.renderer.setRenderTarget(null);
		this.renderer.render(this.copyScene, this.camera);
	}

	public benchmark(): void {
		console.log('\n----------\nStarting benchmark...\n----------\n\n');
	
		if (this.sceneManager.mappings === undefined) return;
	
		const numFrames = this.sceneManager.mappings.numberBenchmarkingFrames;
		const warmupFactor = 0.5;
		let remainingFrames = Math.round(numFrames * (1 + warmupFactor));
		let begin: number;
		let oldBegin: number;
		let end: number;
		const rotationMatrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), 2 * Math.PI / Math.round(numFrames * (1 + warmupFactor)));
		const origin = new THREE.Vector3(0, 0, 0);
		let frameIndex = 0;
	
		this.resetCamera();
	
		const deltaTimes = new Array<number>(numFrames);
		const callback = () => {
			if (remainingFrames <= numFrames) {
				oldBegin = begin;
				begin = performance.now();
			}
	
			this.render();
	
			if (remainingFrames < numFrames) {
				end = performance.now();
				deltaTimes[frameIndex++] = end - oldBegin;
			}
	
			--remainingFrames;
			if (remainingFrames < 0) getResult();
	
			this.camera.position.applyMatrix4(rotationMatrix);
			this.camera.lookAt(origin);
	
			if (remainingFrames >= 0) requestAnimationFrame(callback);
		};
	
		const getResult = () => {
			this.benchmarkResults = 'Resolution,InstancingMethod,QuadtreeDepth,GlyphAtlas,UseShadows,Frametime,Framerate\n';
			const resolution = this.renderer.getSize(new THREE.Vector2);
			const sumTime = deltaTimes.reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);
			console.log('Elapsed time: ' + sumTime + 'ms', 'Average fps: ' + numFrames / (sumTime / 1000));
	
			deltaTimes.sort((a, b) => a - b);
			const maxFT = deltaTimes[deltaTimes.length - 1];
			const zeroPointOneHFT = deltaTimes[Math.round((deltaTimes.length - 1) * 0.999)];
			const oneHFT = deltaTimes[Math.round((deltaTimes.length - 1) * 0.99)];
			const medFT = deltaTimes[Math.round((deltaTimes.length - 1) / 2)];
			const oneLFT = deltaTimes[Math.round((deltaTimes.length - 1) * 0.01)];
			const zeroPointOneLFT = deltaTimes[Math.round((deltaTimes.length - 1) * 0.001)];
			const minFT = deltaTimes[0];
	
			console.log('Min fps: ' + 1 / (maxFT / 1000) + ', 0.1% low: ' + 1 / (zeroPointOneHFT / 1000) + ', 1% low: ' + 1 / (oneHFT / 1000)
				+ ', median: ' + 1 / (medFT / 1000)
				+ ', 1% high: ' + 1 / (oneLFT / 1000) + ', 0.1% high: ' + 1 / (zeroPointOneLFT / 1000) + ', max: ' + 1 / (minFT / 1000));
			
			this.resetCamera();
	
			let stringRepresentation = '';
			for (const deltaTime of deltaTimes) {
				stringRepresentation += resolution.x + 'x' + resolution.y + ',' + InstancingMethod[this.sceneManager.mappings!.instancingMethod] + ',' + this.sceneManager.mappings!.quadtreeDepth + ',' + this.sceneManager.mappings!.basicMappings.glyphAtlas + ',' + this.sceneManager.mappings!.shadowMapSettings.enabled + ',' + deltaTime + ',' + (1000 / deltaTime) + '\n';
			}
	
			this.benchmarkResults = this.benchmarkResults + stringRepresentation;
	
			console.log('\n----------\nEnd of benchmark.\n----------\n\n');
	
			// 🔹 SOLICITAR AL USUARIO EL NOMBRE Y LA DESCRIPCIÓN
			const name = prompt('Ingrese el nombre del benchmark:', `Benchmark ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`);
			const description = prompt('Ingrese una descripción para el benchmark:', 'Este benchmark mide el rendimiento del renderizado en diferentes configuraciones.');
	
			if (name && description) {
				console.log('Subiendo archivo con nombre y descripción...');
				this.uploadBenchmarkResult(name, description);
			} else {
				console.log('Cancelado. No se subirá el benchmark.');
			}
		};
	
		requestAnimationFrame(callback);
	}
	
	public async uploadBenchmarkResult(name: string, description: string): Promise<void> {
		let instancingMethod: string = this.sceneManager.mappings!.instancingMethod === InstancingMethod.None ? 'none' : 
									   this.sceneManager.mappings!.instancingMethod === InstancingMethod.InstancedMesh ? 'im' : 'ibg';
	
		let glyphAtlasResolution: string = this.sceneManager.mappings!.basicMappings.glyphAtlas === 'lodAtlas' ? 'highres' : 
										   this.sceneManager.mappings!.basicMappings.glyphAtlas === 'lodAtlas_verysmall' ? 'lowres' : '';
	
		let shadows: string = this.sceneManager.mappings!.shadowMapSettings.enabled ? 'shadows' : 'plain';
	
		const fileName = `${instancingMethod}-${glyphAtlasResolution}-${shadows}.csv`;
		const file = new File([this.benchmarkResults], fileName, { type: 'text/csv' });
	
		// Crear un FormData para enviar el archivo junto con los nuevos campos
		const formData = new FormData();
		formData.append('name', name);  // Nuevo campo
		formData.append('description', description);  // Nuevo campo
		formData.append('benchmark_file', file);
	
		try {
			const token = localStorage.getItem('token'); // Asegúrate de que haya autenticación
			if (!token) {
				console.error('No se encontró el token de autenticación');
				return;
			}
	
			const response = await fetch('http://localhost:8000/api/benchmark-reports/', {
				method: 'POST',
				headers: {
					'Authorization': `Token ${token}`
				},
				body: formData
			});
	
			if (!response.ok) {
				throw new Error('Error al subir el archivo de benchmark');
			}
	
			console.log('Archivo de benchmark subido exitosamente');
		} catch (error) {
			console.error('Error al subir el archivo de benchmark:', error);
		}
	}
	
}