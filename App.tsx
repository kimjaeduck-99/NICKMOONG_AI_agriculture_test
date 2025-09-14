import { useState, useEffect } from 'react';
import { PriceCard } from './components/PriceCard';
import { SelectionButtons } from './components/SelectionButtons';
import { DiagnosisResult } from './components/DiagnosisResult';
import { Navigation } from './components/Navigation';
import { ChatBot } from './components/ChatBot';
import { QuickActions } from './components/QuickActions';
import { NotificationCenter } from './components/NotificationCenter';
import { VisualMap } from './components/VisualMap';
import { ExpertConnect } from './components/ExpertConnect';
import { Toaster } from './components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { toast } from 'sonner@2.0.3';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Eye,
  Download,
  Share2,
  Bookmark,
  BarChart3,
  Calendar,
  MapPin,
  Map
} from 'lucide-react';

export default function App() {
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifications, setNotifications] = useState(2);
  const [activeRightTab, setActiveRightTab] = useState('info');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // PWA 설치 감지
  useEffect(() => {
    let deferredPrompt: any;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // 설치 프롬프트 표시
      toast.info('앱 설치', {
        description: '홈 화면에 농업 AI를 추가하시겠습니까?',
        action: {
          label: '설치',
          onClick: () => {
            if (deferredPrompt) {
              deferredPrompt.prompt();
              deferredPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                  toast.success('앱이 성공적으로 설치되었습니다!');
                }
                deferredPrompt = null;
              });
            }
          }
        }
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleSelectionComplete = (crop: string, purpose: string) => {
    setSelectedCrop(crop);
    setSelectedPurpose(purpose);
    setShowResult(true);
    toast.success(`${crop} ${purpose} 선택완료`, {
      description: '사진을 업로드하여 AI 진단을 시작하세요.'
    });
  };

  const handleReset = () => {
    setSelectedCrop('');
    setSelectedPurpose('');
    setShowResult(false);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toast.success(isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경');
  };

  const handleClearNotifications = () => {
    setNotifications(0);
    toast.success('모든 알림이 삭제되었습니다.');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'camera':
        toast.info('카메라 기능', { description: '중앙 패널에서 작물을 선택한 후 진단하세요.' });
        break;
      case 'prices':
        toast.info('시세 정보', { description: '왼쪽 패널에서 실시간 시세를 확인하세요.' });
        break;
      case 'weather':
        setActiveRightTab('weather');
        toast.info('날씨 정보로 이동했습니다.');
        break;
      case 'map':
        setActiveRightTab('map');
        toast.info('병충해 지도로 이동했습니다.');
        break;
      case 'expert':
        setActiveRightTab('expert');
        toast.info('전문가 연결 서비스로 이동했습니다.');
        break;
      case 'install-app':
        toast.info('앱 설치', { 
          description: '브라우저의 설치 버튼을 클릭하거나 공유 메뉴에서 "홈 화면에 추가"를 선택하세요.' 
        });
        break;
      default:
        toast.info(`${action} 기능`, { description: '해당 기능은 개발 중입니다.' });
    }
  };

  const weatherData = {
    current: { temp: 22, condition: 'sunny', humidity: 65, rain: 10 },
    forecast: [
      { day: '오늘', high: 25, low: 18, condition: 'sunny', rain: 10 },
      { day: '내일', high: 23, low: 17, condition: 'cloudy', rain: 30 },
      { day: '모레', high: 20, low: 15, condition: 'rainy', rain: 80 },
      { day: '글피', high: 24, low: 19, condition: 'sunny', rain: 5 }
    ]
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />;
      default: return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#f4f8f1] dark:bg-gray-900 transition-colors duration-300">
        {/* Navigation */}
        <Navigation
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          notifications={notifications}
          onClearNotifications={handleClearNotifications}
        />

        {/* Main Content */}
        <div className="p-4 lg:p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-green-800 dark:text-green-400 mb-2">
                🌾 농업 AI 진단 시스템
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                실시간 농산물 시세 확인과 AI 기반 작물 진단 서비스
              </p>
              
              {/* Status Badges */}
              <div className="flex justify-center gap-2 mt-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  실시간 연결
                </Badge>
                <Badge variant="outline">AI 진단 가능</Badge>
                <Badge variant="outline">오프라인 지원</Badge>
              </div>
            </div>

            {/* Three Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 min-h-[calc(100vh-280px)]">
              {/* Left Column - Price Information */}
              <div className="order-2 lg:order-1">
                <PriceCard />
              </div>

              {/* Center Column - Main Interface */}
              <div className="order-1 lg:order-2">
                {!showResult ? (
                  <SelectionButtons onSelectionComplete={handleSelectionComplete} />
                ) : (
                  <DiagnosisResult 
                    crop={selectedCrop}
                    purpose={selectedPurpose}
                    onReset={handleReset}
                  />
                )}
              </div>

              {/* Right Column - Tabbed Information */}
              <div className="order-3 lg:order-3">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <Tabs value={activeRightTab} onValueChange={setActiveRightTab}>
                      <TabsList className="grid w-full grid-cols-5 text-xs">
                        <TabsTrigger value="info">정보</TabsTrigger>
                        <TabsTrigger value="weather">날씨</TabsTrigger>
                        <TabsTrigger value="map">지도</TabsTrigger>
                        <TabsTrigger value="expert">전문가</TabsTrigger>
                        <TabsTrigger value="tools">도구</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  
                  <CardContent className="p-0 h-[calc(100%-80px)]">
                    <Tabs value={activeRightTab} onValueChange={setActiveRightTab}>
                      <TabsContent value="info" className="mt-0 p-4 h-full overflow-y-auto">
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                            <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              농업 달력
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              9월 둘째 주<br />
                              • 가을 배추 정식 시기<br />
                              • 고추 수확 및 건조<br />
                              • 마늘 파종 준비
                            </p>
                          </div>

                          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">⚠️ 병해충 경보</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              • 토마토 잎마름병 주의<br />
                              • 배추 무름병 발생 가능<br />
                              • 진딧물 방제 시기
                            </p>
                          </div>

                          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                            <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-2">💡 농업 팁</h4>
                            <p className="text-sm text-purple-700 dark:text-purple-300">
                              가을철 물 관리는 아침 시간대에<br />
                              하는 것이 병해 예방에 효과적입니다.
                            </p>
                          </div>

                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                            <h4 className="font-medium text-green-800 dark:text-green-400 mb-2 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              지역 정보
                            </h4>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              경기도 남부 지역<br />
                              • 토양 pH 6.2 (적정)<br />
                              • 주요 재배 작물: 배추, 무<br />
                              • 농업기술센터: 031-123-4567
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="weather" className="mt-0 p-4 h-full overflow-y-auto">
                        <div className="space-y-4">
                          {/* Current Weather */}
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-blue-800 dark:text-blue-400">현재 날씨</h4>
                              {getWeatherIcon(weatherData.current.condition)}
                            </div>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-2">
                              {weatherData.current.temp}°C
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-blue-700 dark:text-blue-300">
                              <div>습도: {weatherData.current.humidity}%</div>
                              <div>강수: {weatherData.current.rain}%</div>
                            </div>
                          </div>

                          {/* Weather Forecast */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">4일 예보</h4>
                            {weatherData.forecast.map((day, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                  {getWeatherIcon(day.condition)}
                                  <span className="text-sm font-medium">{day.day}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">{day.low}°</span>
                                  <span className="font-medium">{day.high}°</span>
                                  <span className="text-blue-600 dark:text-blue-400">{day.rain}%</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Weather Actions */}
                          <div className="space-y-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => toast.info('기상특보를 확인했습니다.')}
                            >
                              <Wind className="w-4 h-4 mr-2" />
                              기상특보 확인
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => toast.info('상세 예보를 확인했습니다.')}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              상세 예보
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="map" className="mt-0 p-4 h-full overflow-y-auto">
                        <VisualMap />
                      </TabsContent>

                      <TabsContent value="expert" className="mt-0 p-4 h-full overflow-y-auto">
                        <ExpertConnect />
                      </TabsContent>

                      <TabsContent value="tools" className="mt-0 p-4 h-full overflow-y-auto">
                        <QuickActions onActionClick={handleQuickAction} />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Action Bar (Mobile) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 z-40 shadow-lg">
              <div className="flex justify-around items-center">
                <Button variant="ghost" size="sm" onClick={() => handleQuickAction('camera')} className="flex flex-col gap-1 h-auto py-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-xs">진단</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleQuickAction('prices')} className="flex flex-col gap-1 h-auto py-2">
                  <Share2 className="w-5 h-5" />
                  <span className="text-xs">시세</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleQuickAction('map')} className="flex flex-col gap-1 h-auto py-2">
                  <Map className="w-5 h-5" />
                  <span className="text-xs">지도</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleQuickAction('install-app')} className="flex flex-col gap-1 h-auto py-2">
                  <Download className="w-5 h-5" />
                  <span className="text-xs">설치</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Components */}
        <ChatBot />
        <NotificationCenter onNotificationCount={setNotifications} />
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: isDarkMode ? '#374151' : '#ffffff',
              color: isDarkMode ? '#f9fafb' : '#111827',
              border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb'
            }
          }}
        />
      </div>
    </div>
  );
}