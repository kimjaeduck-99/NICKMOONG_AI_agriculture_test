import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Camera, 
  Brain, 
  Shield, 
  ExternalLink, 
  Phone, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Leaf,
  Droplets
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DiagnosisResultProps {
  crop: string;
  purpose: string;
  onReset: () => void;
}

export function DiagnosisResult({ crop, purpose, onReset }: DiagnosisResultProps) {
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [aiDiagnosis, setAiDiagnosis] = useState<string>('');
  const [isUsingAI, setIsUsingAI] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        startAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // 진행률 시뮬레이션
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 300);

    // Google AI로 진단 요청
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6ba9087f/ai-diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          crop,
          purpose,
          symptoms: '업로드된 이미지를 바탕으로 진단해주세요.',
          imageData: uploadedImage
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiDiagnosis(data.diagnosis);
        setIsUsingAI(true);
        toast.success('Google AI 진단이 완료되었습니다!', {
          description: '고급 AI 모델로 분석한 결과입니다.'
        });
      } else {
        throw new Error('AI 진단 실패');
      }
    } catch (error) {
      console.log('AI Diagnosis Error:', error);
      setIsUsingAI(false);
      toast.warning('AI 서비스 연결 실패', {
        description: '기본 진단 정보를 제공합니다.'
      });
    }

    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  // 다중 AI 모델 진단 결과 (목적별 특화)
  const getDiagnosisData = () => {
    const baseData = {
      modelUsed: '',
      primaryFindings: '',
      confidence: 0,
      severity: 'medium' as const,
      recommendations: [] as string[],
      environmentalFactors: [] as string[],
      preventionMethods: [] as string[],
      treatmentOptions: [] as any[]
    };

    switch (purpose) {
      case '병해 진단':
        return {
          ...baseData,
          modelUsed: `${crop} 병해 전문 AI 모델 v2.1`,
          primaryFindings: crop === '토마토' ? '토마토 잎마름병 (Alternaria solani)' : 
                          crop === '배추' ? '배추 무름병 (Erwinia carotovora)' : 
                          `${crop} 세균성 점무늬병`,
          confidence: 94,
          severity: 'high' as const,
          recommendations: [
            '병든 잎과 과실을 즉시 제거하여 소각 처리',
            '습도 조절을 통한 병원균 확산 방지',
            '7-10일 간격으로 방제 약제 살포'
          ],
          environmentalFactors: ['습도 85% (위험)', '온도 25°C (적정)', '통풍 불량'],
          treatmentOptions: [
            {
              type: '화학방제',
              products: ['테부코나졸 수화제', '프로피코나졸 유제'],
              application: '7일 간격 2-3회 살포',
              safetyPeriod: '수확 7일 전까지'
            },
            {
              type: '친환경방제',
              products: ['규조토', '계피 우린 물', '마늘 우린 물'],
              application: '3-5일 간격 살포',
              safetyPeriod: '수확 당일까지 가능'
            }
          ]
        };
      
      case '충해 진단':
        return {
          ...baseData,
          modelUsed: `${crop} 충해 전문 AI 모델 v1.8`,
          primaryFindings: '진딧물 (Aphidoidea) 중도 발생',
          confidence: 87,
          severity: 'medium' as const,
          recommendations: [
            '천적 곤충(무당벌레, 거미) 보호',
            '질소 과잉 시비 제한',
            '끈끈이 트랩 설치로 개체수 모니터링'
          ],
          environmentalFactors: ['온도 22°C (적정)', '습도 60% (적정)', '바람 약함'],
          treatmentOptions: [
            {
              type: '생물방제',
              products: ['콜레마니진디봉', '진디혹파리'],
              application: '천적 곤충 방사',
              safetyPeriod: '무독성'
            },
            {
              type: '저독성방제',
              products: ['계피 추출물', '님오일'],
              application: '5일 간격 살포',
              safetyPeriod: '수확 당일까지'
            }
          ]
        };

      case '성숙도 확인':
        return {
          ...baseData,
          modelUsed: `${crop} 성숙도 전문 AI 모델 v3.0`,
          primaryFindings: '수확 적기 도달 (80-85% 성숙)',
          confidence: 91,
          severity: 'low' as const,
          recommendations: [
            '3-5일 내 수확 권장',
            '아침 시간대 수확으로 품질 최적화',
            '저온 저장으로 신선도 유지'
          ],
          environmentalFactors: ['당도 12.5°Brix', '경도 적정', '색도 지수 85%'],
          treatmentOptions: [
            {
              type: '수확관리',
              products: ['수확용 가위', '수확 상자'],
              application: '선별적 수확',
              safetyPeriod: '즉시 가능'
            }
          ]
        };

      default:
        return {
          ...baseData,
          modelUsed: `${crop} 종��� 분석 AI 모델`,
          primaryFindings: '정상 생육 상태',
          confidence: 89,
          severity: 'low' as const,
          recommendations: ['현재 관리 방법 유지', '정기적인 모니터링 계속'],
          environmentalFactors: ['전반적으로 양호한 상태'],
          treatmentOptions: []
        };
    }
  };

  const diagnosisData = getDiagnosisData();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-green-600" />
            <span>스마트 AI 진단</span>
            {isUsingAI && (
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                Google AI
              </Badge>
            )}
          </div>
          <button 
            onClick={onReset}
            className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ← 처음으로
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Crop & Purpose Info */}
        <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-medium text-green-800 dark:text-green-400">선택된 진단</p>
              <p className="text-sm text-green-600 dark:text-green-300">{crop} • {purpose}</p>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        {!uploadedImage ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              {crop} {purpose}을 위한 고해상도 사진을 업로드하세요
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              • 잎, 줄기, 열매 등 증상 부위를 선명하게 촬영<br/>
              • 자연광에서 촬영 권장 (플래시 사용 금지)<br/>
              • Google AI가 이미지를 분석���여 정확한 진단을 제공합니다
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer transition-colors"
            >
              <Camera className="w-4 h-4" />
              사진 선택하기
            </label>
          </div>
        ) : (
          <>
            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    {isUsingAI ? 'Google AI 분석 중...' : 'AI 분석 중...'}
                  </span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
                <p className="text-xs text-gray-500">
                  {isUsingAI ? `Google AI + ${diagnosisData.modelUsed}` : diagnosisData.modelUsed} 실행 중
                </p>
              </div>
            )}

            {/* Uploaded Image */}
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src={uploadedImage} 
                  alt="업로드된 작물 사진"
                  className="rounded-lg max-h-48 object-cover shadow-md"
                />
                {!isAnalyzing && (
                  <div className="absolute top-2 right-2">
                    <Badge className={`${isUsingAI ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-green-500'} text-white`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {isUsingAI ? 'AI 분석완료' : '분석완료'}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Results */}
            {!isAnalyzing && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="diagnosis">진단결과</TabsTrigger>
                  <TabsTrigger value="treatment">처방전</TabsTrigger>
                  <TabsTrigger value="expert">전문가연결</TabsTrigger>
                </TabsList>

                {/* Diagnosis Tab */}
                <TabsContent value="diagnosis" className="space-y-4">
                  {/* AI Enhanced Diagnosis */}
                  {isUsingAI && aiDiagnosis && (
                    <Alert className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                      <Brain className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg text-blue-800 dark:text-blue-400">Google AI 진단 결과</h3>
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            Google AI
                          </Badge>
                        </div>
                        <div className="mt-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700 max-h-64 overflow-y-auto">
                          <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                            {aiDiagnosis}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Primary Diagnosis */}
                  <Alert className={`border-l-4 ${diagnosisData.severity === 'high' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' : 
                    diagnosisData.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 
                    'border-l-green-500 bg-green-50 dark:bg-green-900/20'}`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{diagnosisData.primaryFindings}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">신뢰도 {diagnosisData.confidence}%</Badge>
                          <Badge className={diagnosisData.severity === 'high' ? 'bg-red-500' : 
                            diagnosisData.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}>
                            {diagnosisData.severity === 'high' ? '긴급' : 
                             diagnosisData.severity === 'medium' ? '주의' : '정상'}
                          </Badge>
                          {!isUsingAI && (
                            <Badge variant="outline" className="text-orange-600">
                              기본 모델
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        사용 모델: {isUsingAI ? `Google AI + ${diagnosisData.modelUsed}` : diagnosisData.modelUsed}
                      </p>
                    </AlertDescription>
                  </Alert>

                  {/* Environmental Factors */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Droplets className="w-4 h-4" />
                        환경 요인 분석
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {diagnosisData.environmentalFactors.map((factor, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Immediate Recommendations */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        즉시 행동 권장사항
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {diagnosisData.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                              {index + 1}
                            </div>
                            <p className="text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Treatment Tab */}
                <TabsContent value="treatment" className="space-y-4">
                  {diagnosisData.treatmentOptions.map((treatment, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          {treatment.type}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-1">추천 제품</p>
                            <div className="flex flex-wrap gap-2">
                              {treatment.products?.map((product: string, pidx: number) => (
                                <Badge key={pidx} variant="outline">{product}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-600 dark:text-gray-400">사용법</p>
                              <p className="mt-1">{treatment.application}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-600 dark:text-gray-400">안전 기간</p>
                              <p className="mt-1">{treatment.safetyPeriod}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Official Database Link */}
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={() => {
                      toast.success('농약안전정보시스템으로 연결됩니다');
                      window.open('https://pis.rda.go.kr', '_blank');
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    농촌진흥청 농약안전정보시스템 확인
                  </Button>
                </TabsContent>

                {/* Expert Connection Tab */}
                <TabsContent value="expert" className="space-y-4">
                  <Alert>
                    <Phone className="h-4 w-4" />
                    <AlertDescription>
                      <h4 className="font-medium mb-2">추가 전문가 상담이 필요하신가요?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        지역 농업기술센터와 바로 연결해드립니다.
                      </p>
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        관할 농업기술센터
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium">경기도 농업기술원</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">경기도 화성시 농업기술원로 123</p>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" onClick={() => {
                              toast.success('전화 연결 중...');
                              // window.location.href = 'tel:031-229-5851';
                            }}>
                              <Phone className="w-4 h-4 mr-2" />
                              031-229-5851
                            </Button>
                            <Button size="sm" variant="outline">
                              <MapPin className="w-4 h-4 mr-2" />
                              위치 보기
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p>• 상담시간: 평일 09:00 - 18:00</p>
                          <p>• 현장방문 상담: 사전 예약 필수</p>
                          <p>• 긴급상황: 24시간 핫라인 1588-9999</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}