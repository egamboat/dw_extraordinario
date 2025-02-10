import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { stepsGuide } from '../data/GuideArray';
import { NavbarPublic } from '../componets/NavbarPublic';


export const Guide = () => {

    const [currentStep, setCurrentStep] = useState(0);
    const [logged, setLogged] = useState<boolean>(false)

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("username");

        if (token && user) {
            setLogged(true)
        }
    }, []);

    const goToNextStep = () => {
        setCurrentStep((prev) => (prev < stepsGuide.length - 1 ? prev + 1 : prev));
    };

    const goToPrevStep = () => {
        setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
    };

    return (
        <>
            <NavbarPublic
                logged={logged}
                onLanding={false}
            >
            </NavbarPublic>
            <div className="w-full h-screen bg-gray-50 flex items-center justify-center px-8">

                <div className="w-full max-w-6xl flex items-center gap-4">
                    <button
                        onClick={goToPrevStep}
                        disabled={currentStep === 0}
                        className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="flex-1 bg-white rounded-xl p-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-8xl font-bold text-purple-600 leading-none">
                                        {stepsGuide[currentStep].number}
                                    </span>
                                    <h2 className="text-2xl font-bold">
                                        {stepsGuide[currentStep].title}
                                    </h2>
                                </div>

                                <p className="text-gray-600 text-lg">
                                    {stepsGuide[currentStep].description}
                                </p>
                            </div>

                            <div className="flex items-center justify-center">
                                <img
                                    src={stepsGuide[currentStep].imageUrl}
                                    alt={`Paso ${stepsGuide[currentStep].number}`}
                                    className="w-full h-64 object-cover rounded-lg shadow-md"
                                />
                            </div>
                        </div>

                        <div className="mt-10 flex justify-center gap-2">
                            {stepsGuide.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-3 h-3 rounded-full ${index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={goToNextStep}
                        disabled={currentStep === stepsGuide.length - 1}
                        className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </>
    );
};
