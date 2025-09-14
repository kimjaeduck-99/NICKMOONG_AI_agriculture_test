import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SelectionButtonsProps {
  onSelectionComplete: (crop: string, purpose: string) => void;
}

const crops = [
  { emoji: '🍅', name: '토마토', id: 'tomato', models: ['잎마름병', '역병', '갈색무늬병', '바이러스병'] },
  { emoji: '🥒', name: '오이', id: 'cucumber', models: ['노균병', '흰가루병', '탄저병', '세균성점무늬병'] },
  { emoji: '🌶️', name: '고추', id: 'pepper', models: ['탄저병', '역병', '세균성점무늬병', '바이러스병'] },
  { emoji: '🥬', name: '배추', id: 'cabbage', models: ['무름병', '노균병', '뿌리혹병', '바이러스병'] },
  { emoji: '🧄', name: '마늘', id: 'garlic', models: ['흑색썩음병', '잎마름병', '노균병', '바이러스병'] },
  { emoji: '🧅', name: '양파', id: 'onion', models: ['노균병', '흑색썩음병', '세균성썩음병', '잎마름병'] },
  { emoji: '🌽', name: '옥수수', id: 'corn', models: ['깜부기병', '잎마름병', '조명나방', '진딧물'] },
  { emoji: '🥕', name: '당근', id: 'carrot', models: ['검은무늬병', '뿌리썩음병', '진딧물', '선충'] }
];

const purposes = [
  { 
    emoji: '🦠', 
    name: '병해 진단', 
    id: 'disease',
    description: '곰팡이성·세균성·바이러스성 질병 전문 분석',
    modelCount: '12개 특화 모델'
  },
  { 
    emoji: '🐛', 
    name: '충해 진단', 
    id: 'pest',
    description: '해충 종류 식별 및 피해 정도 분석',
    modelCount: '8개 특화 모델'
  },
  { 
    emoji: '🍎', 
    name: '성숙도 확인', 
    id: 'maturity',
    description: '수확 적기 판단을 위한 숙성도 분석',
    modelCount: '6개 특화 모델'
  },
  { 
    emoji: '🌱', 
    name: '생육 상태', 
    id: 'growth',
    description: '영양 결핍·과잉 및 생장 상태 분석',
    modelCount: '10개 특화 모델'
  }
];

export function SelectionButtons({ onSelectionComplete }: SelectionButtonsProps) {
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');
  const [stage, setStage] = useState<'crop' | 'purpose'>('crop');

  const handleCropSelect = (cropId: string) => {
    setSelectedCrop(cropId);
    setStage('purpose');
  };

  const handlePurposeSelect = (purposeId: string) => {
    setSelectedPurpose(purposeId);
    const cropName = crops.find(c => c.id === selectedCrop)?.name || '';
    const purposeName = purposes.find(p => p.id === purposeId)?.name || '';
    onSelectionComplete(cropName, purposeName);
  };

  const handleBack = () => {
    setStage('crop');
    setSelectedPurpose('');
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {stage === 'crop' ? '🌱 작물 선택' : '🎯 진단 목적 선택'}
          </span>
          {stage === 'purpose' && (
            <button 
              onClick={handleBack}
              className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              ← 뒤로
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {stage === 'crop' ? (
          <div className="grid grid-cols-2 gap-3">
            {crops.map((crop) => (
              <button
                key={crop.id}
                onClick={() => handleCropSelect(crop.id)}
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-white border-2 border-green-200 text-green-700 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 min-h-[100px] group relative"
              >
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {crop.emoji}
                </span>
                <span className="font-medium text-center text-sm">{crop.name}</span>
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full opacity-70"></div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {purposes.map((purpose) => (
              <button
                key={purpose.id}
                onClick={() => handlePurposeSelect(purpose.id)}
                className="w-full p-4 rounded-lg bg-white border-2 border-green-200 text-left hover:bg-green-50 hover:border-green-400 transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    {purpose.emoji}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-green-800">{purpose.name}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {purpose.modelCount}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{purpose.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <div className={`w-3 h-3 rounded-full ${stage === 'crop' ? 'bg-green-500' : 'bg-green-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${stage === 'purpose' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}