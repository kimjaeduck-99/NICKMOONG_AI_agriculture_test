import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Calendar,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  ChevronRight,
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

interface PestAlert {
  id: string;
  region: string;
  pestType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  crop: string;
  reportedDate: string;
  affectedArea: string;
  coordinates: { lat: number; lng: number };
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  author: string;
  publishDate: string;
  category: string;
  image: string;
  likes: number;
  comments: number;
  readTime: string;
}

const pestAlerts: PestAlert[] = [
  {
    id: '1',
    region: '경기도 안산시',
    pestType: '토마토 잎마름병',
    severity: 'high',
    crop: '토마토',
    reportedDate: '2024-09-10',
    affectedArea: '15헥타르',
    coordinates: { lat: 37.32, lng: 126.83 }
  },
  {
    id: '2',
    region: '충남 천안시',
    pestType: '배추 무름병',
    severity: 'medium',
    crop: '배추',
    reportedDate: '2024-09-09',
    affectedArea: '8헥타르',
    coordinates: { lat: 36.81, lng: 127.11 }
  },
  {
    id: '3',
    region: '전북 전주시',
    pestType: '진딧물',
    severity: 'low',
    crop: '고추',
    reportedDate: '2024-09-08',
    affectedArea: '3헥타르',
    coordinates: { lat: 35.82, lng: 127.11 }
  },
  {
    id: '4',
    region: '경남 창원시',
    pestType: '노균병',
    severity: 'critical',
    crop: '오이',
    reportedDate: '2024-09-11',
    affectedArea: '22헥타르',
    coordinates: { lat: 35.23, lng: 128.68 }
  },
  {
    id: '5',
    region: '강원도 춘천시',
    pestType: '감자 역병',
    severity: 'high',
    crop: '감자',
    reportedDate: '2024-09-12',
    affectedArea: '12헥타르',
    coordinates: { lat: 37.87, lng: 127.73 }
  },
  {
    id: '6',
    region: '경북 구미시',
    pestType: '총채벌레',
    severity: 'medium',
    crop: '고추',
    reportedDate: '2024-09-11',
    affectedArea: '6헥타르',
    coordinates: { lat: 36.12, lng: 128.34 }
  },
  {
    id: '7',
    region: '전남 나주시',
    pestType: '도열병',
    severity: 'critical',
    crop: '벼',
    reportedDate: '2024-09-13',
    affectedArea: '35헥타르',
    coordinates: { lat: 35.01, lng: 126.71 }
  },
  {
    id: '8',
    region: '제주도 제주시',
    pestType: '귤응애',
    severity: 'low',
    crop: '감귤',
    reportedDate: '2024-09-09',
    affectedArea: '4헥타르',
    coordinates: { lat: 33.50, lng: 126.53 }
  }
];

const newsItems: NewsItem[] = [
  {
    id: '1',
    title: '스마트농업 기술로 수확량 30% 증가',
    summary: 'IoT 센서와 AI 분석을 활용한 스마트팜에서 기존 대비 30% 수확량 증가를 달성했습니다.',
    author: '김농업',
    publishDate: '2024-09-12',
    category: '기술',
    image: 'https://images.unsplash.com/photo-1722119272044-fc49006131e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMHRlY2hub2xvZ3klMjBkaWdpdGFsJTIwZmFybWluZ3xlbnwxfHx8fDE3NTc2ODExNDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 127,
    comments: 23,
    readTime: '3분'
  },
  {
    id: '2',
    title: '유기농 인증 농가 지원 사업 확대',
    summary: '정부에서 유기농 인증 농가에 대한 지원 사업을 확대하여 더 많은 농가가 혜택을 받을 수 있게 되었습니다.',
    author: '이현수',
    publishDate: '2024-09-11',
    category: '정책',
    image: 'https://images.unsplash.com/photo-1589402819889-8c1b0d97acda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwYWdyaWN1bHR1cmUlMjBuZXdzJTIwY29tbXVuaXR5fGVufDF8fHx8MTc1NzY4MTEzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 89,
    comments: 15,
    readTime: '2분'
  },
  {
    id: '3',
    title: '가을철 병해충 방제 요령',
    summary: '가을철 주요 병해충별 방제 방법과 예방 수칙에 대해 알아보세요.',
    author: '농업기술센터',
    publishDate: '2024-09-10',
    category: '교육',
    image: 'https://images.unsplash.com/photo-1694100223107-c898e5c117c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBwbGFudCUyMGRpc2Vhc2UlMjBsZWFmfGVufDF8fHx8MTc1NzY4MTE0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 156,
    comments: 34,
    readTime: '5분'
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-yellow-500 text-white';
    case 'low': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical': return <Zap className="w-3 h-3" />;
    case 'high': return <AlertTriangle className="w-3 h-3" />;
    case 'medium': return <Activity className="w-3 h-3" />;
    case 'low': return <Shield className="w-3 h-3" />;
    default: return <Activity className="w-3 h-3" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case '기술': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case '정책': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    case '교육': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

export function VisualMap() {
  const [activeView, setActiveView] = useState<'map' | 'news' | 'analytics'>('map');
  const [selectedAlert, setSelectedAlert] = useState<PestAlert | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  return (
    <div className="space-y-4 h-full">
      {/* View Toggle */}
      <div className="grid grid-cols-3 gap-1">
        <Button
          variant={activeView === 'map' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('map')}
        >
          <MapPin className="w-4 h-4 mr-1" />
          지도
        </Button>
        <Button
          variant={activeView === 'analytics' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('analytics')}
        >
          <BarChart3 className="w-4 h-4 mr-1" />
          분석
        </Button>
        <Button
          variant={activeView === 'news' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('news')}
        >
          <Users className="w-4 h-4 mr-1" />
          뉴스
        </Button>
      </div>

      {/* Pest Disease Map View */}
      {activeView === 'map' && (
        <div className="space-y-4">
          {/* Filter Options */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterSeverity === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterSeverity('all')}
            >
              전체 ({pestAlerts.length})
            </Button>
            <Button
              variant={filterSeverity === 'critical' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => setFilterSeverity('critical')}
            >
              긴급 ({pestAlerts.filter(a => a.severity === 'critical').length})
            </Button>
            <Button
              variant={filterSeverity === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterSeverity('high')}
              className={filterSeverity === 'high' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              높음 ({pestAlerts.filter(a => a.severity === 'high').length})
            </Button>
          </div>

          {/* Map Image */}
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1669841358008-097d13f97457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmYXJtJTIwZmllbGQlMjBhZXJpYWwlMjB2aWV3fGVufDF8fHx8MTc1NzY4MTE0MXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="농업 지역 항공뷰"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                
                {/* Map Overlays */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="flex justify-between items-center">
                    <Badge className="bg-white/90 text-gray-800">
                      전국 병충해 현황 ({new Date().toLocaleDateString()})
                    </Badge>
                    <div className="flex gap-2">
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        긴급 {pestAlerts.filter(a => a.severity === 'critical').length}건
                      </Badge>
                      <Badge className="bg-orange-500 text-white flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        경보 {pestAlerts.filter(a => a.severity === 'high').length}건
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Map Markers */}
                <div className="absolute inset-0">
                  {pestAlerts
                    .filter(alert => filterSeverity === 'all' || alert.severity === filterSeverity)
                    .map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`absolute w-5 h-5 rounded-full cursor-pointer ${getSeverityColor(alert.severity)} 
                        flex items-center justify-center shadow-lg hover:scale-125 transition-transform z-10
                        ${alert.severity === 'critical' ? 'animate-pulse' : ''}`}
                      style={{
                        left: `${15 + (index * 12) % 70}%`,
                        top: `${25 + (index * 8) % 50}%`
                      }}
                      onClick={() => setSelectedAlert(alert)}
                      title={`${alert.region} - ${alert.pestType}`}
                    >
                      {getSeverityIcon(alert.severity)}
                      {alert.severity === 'critical' && (
                        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>긴급</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>높음</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>보통</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>낮음</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Details */}
          {selectedAlert && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{selectedAlert.pestType}</CardTitle>
                    <Badge className={getSeverityColor(selectedAlert.severity)}>
                      {selectedAlert.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">지역</p>
                      <p className="font-medium">{selectedAlert.region}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">작물</p>
                      <p className="font-medium">{selectedAlert.crop}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">피해 면적</p>
                      <p className="font-medium">{selectedAlert.affectedArea}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">신고일</p>
                      <p className="font-medium">{selectedAlert.reportedDate}</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-4">
                    <Eye className="w-4 h-4 mr-2" />
                    상세 정보 보기
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-red-600">{pestAlerts.filter(a => a.severity === 'critical').length + pestAlerts.filter(a => a.severity === 'high').length}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">활성 경보</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-600">{pestAlerts.length}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">총 발생지역</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-600">
                      {pestAlerts.reduce((sum, alert) => sum + parseInt(alert.affectedArea), 0)}ha
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">총 피해면적</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">89%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">방제 성공률</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                최근 발생 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pestAlerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity).split(' ')[0]}`}></div>
                      <div>
                        <p className="text-sm font-medium">{alert.pestType}</p>
                        <p className="text-xs text-gray-500">{alert.region} • {alert.crop}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{alert.reportedDate}</p>
                      <p className="text-xs font-medium">{alert.affectedArea}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <div className="space-y-4">
          {/* Trend Analysis */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                주간 발생 추이
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">이번 주</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-red-200 rounded-full overflow-hidden">
                      <div className="w-9 h-full bg-red-500"></div>
                    </div>
                    <span className="text-sm font-medium">8건</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">지난 주</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-yellow-200 rounded-full overflow-hidden">
                      <div className="w-6 h-full bg-yellow-500"></div>
                    </div>
                    <span className="text-sm font-medium">5건</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">2주 전</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-green-200 rounded-full overflow-hidden">
                      <div className="w-4 h-full bg-green-500"></div>
                    </div>
                    <span className="text-sm font-medium">3건</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crop Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                작물별 발생 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { crop: '토마토', count: 2, color: 'bg-red-500' },
                  { crop: '배추', count: 1, color: 'bg-green-500' },
                  { crop: '고추', count: 2, color: 'bg-orange-500' },
                  { crop: '오이', count: 1, color: 'bg-blue-500' },
                  { crop: '기타', count: 2, color: 'bg-purple-500' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm">{item.crop}</span>
                    </div>
                    <span className="text-sm font-medium">{item.count}건</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                위험도 평가
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-800 dark:text-red-400">고위험 지역</span>
                    <Badge variant="destructive" size="sm">2곳</Badge>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-300">
                    경남 창원시, 전남 나주시
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">주의 지역</span>
                    <Badge className="bg-yellow-500 text-white" size="sm">3곳</Badge>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    경기도 안산시, 강원도 춘천시, 경북 구미시
                  </p>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800 dark:text-green-400">안전 지역</span>
                    <Badge className="bg-green-500 text-white" size="sm">3곳</Badge>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    충남 천안시, 전북 전주시, 제주도 제주시
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prevention Recommendations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                주요 예방 대책
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>습도 관리: 시설 내 환기 시설 점검 및 가동</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>예방 살포: 친환경 방제제 정기 살포</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>모니터링: 작물 상태 일일 점검 강화</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>신속 대응: 의심 증상 발견 시 즉시 전문가 상담</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Community News View */}
      {activeView === 'news' && (
        <div className="space-y-4">
          {newsItems.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <ImageWithFallback
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover rounded-l-lg"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge size="sm" className={getCategoryColor(news.category)}>
                          {news.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{news.readTime}</span>
                      </div>
                      <h4 className="font-medium text-sm mb-2 line-clamp-2">{news.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {news.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {news.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {news.comments}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{news.author}</span>
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Load More */}
          <Button variant="outline" className="w-full">
            <TrendingUp className="w-4 h-4 mr-2" />
            더 많은 뉴스 보기
          </Button>
        </div>
      )}
    </div>
  );
}