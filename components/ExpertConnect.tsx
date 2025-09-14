import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Phone, 
  MapPin, 
  Clock, 
  User, 
  MessageCircle, 
  Video,
  Star,
  Search,
  ExternalLink,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Expert {
  id: string;
  name: string;
  title: string;
  organization: string;
  location: string;
  phone: string;
  specialties: string[];
  rating: number;
  experience: number;
  consultationCount: number;
  availability: 'available' | 'busy' | 'offline';
  responseTime: string;
  languages: string[];
  image: string;
}

interface AgricultureCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
  region: string;
  services: string[];
  operatingHours: string;
  emergencyPhone?: string;
  website?: string;
  experts: Expert[];
}

const mockExperts: Expert[] = [
  {
    id: '1',
    name: '김농업',
    title: '수석 연구원',
    organization: '경기도 농업기술원',
    location: '화성시',
    phone: '031-229-5851',
    specialties: ['병해충 방제', '토마토 재배', '유기농업'],
    rating: 4.8,
    experience: 15,
    consultationCount: 1247,
    availability: 'available',
    responseTime: '평균 2시간',
    languages: ['한국어', '영어'],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: '이현수',
    title: '농업기술지도사',
    organization: '수원시 농업기술센터',
    location: '수원시',
    phone: '031-228-2114',
    specialties: ['배추 재배', '토양 관리', '스마트팜'],
    rating: 4.9,
    experience: 12,
    consultationCount: 892,
    availability: 'busy',
    responseTime: '평균 4시간',
    languages: ['한국어'],
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: '박영희',
    title: '병해충 전문가',
    organization: '농촌진흥청',
    location: '전주시',
    phone: '063-238-1234',
    specialties: ['병해충 진단', '친환경 방제', '연구개발'],
    rating: 4.7,
    experience: 20,
    consultationCount: 2103,
    availability: 'available',
    responseTime: '평균 1시간',
    languages: ['한국어', '일본어'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
  }
];

const mockCenters: AgricultureCenter[] = [
  {
    id: '1',
    name: '경기도 농업기술원',
    address: '경기도 화성시 농업기술원로 123',
    phone: '031-229-5851',
    region: '경기도',
    services: ['기술지도', '병해충 진단', '토양분석', '교육프로그램'],
    operatingHours: '평일 09:00 - 18:00',
    emergencyPhone: '031-229-5999',
    website: 'https://www.gares.go.kr',
    experts: [mockExperts[0]]
  },
  {
    id: '2',
    name: '수원시 농업기술센터',
    address: '경기도 수원시 영통구 농업기술센터로 456',
    phone: '031-228-2114',
    region: '경기도 수원시',
    services: ['재배기술지도', '농기계 교육', '친환경농업', '청년농업인 육성'],
    operatingHours: '평일 09:00 - 18:00, 토요일 09:00 - 12:00',
    website: 'https://suwon.go.kr/agri',
    experts: [mockExperts[1]]
  },
  {
    id: '3',
    name: '농촌진흥청 본청',
    address: '전라북도 전주시 덕진구 농생명로 300',
    phone: '063-238-1000',
    region: '전국',
    services: ['연구개발', '기술보급', '농업정책', '국제협력'],
    operatingHours: '평일 09:00 - 18:00',
    emergencyPhone: '1588-9999',
    website: 'https://www.rda.go.kr',
    experts: [mockExperts[2]]
  }
];

export function ExpertConnect() {
  const [activeTab, setActiveTab] = useState<'experts' | 'centers'>('experts');
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<AgricultureCenter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'busy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'offline': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return '상담 가능';
      case 'busy': return '상담 중';
      case 'offline': return '오프라인';
      default: return '알 수 없음';
    }
  };

  const handleCall = (phone: string, name: string) => {
    toast.success(`${name} 전문가와 연결 중...`);
    // window.location.href = `tel:${phone}`;
  };

  const handleVideoCall = (expertId: string, name: string) => {
    toast.info(`${name} 전문가와 화상 상담을 요청했습니다.`);
  };

  const handleMessage = (expertId: string, name: string) => {
    toast.info(`${name} 전문가에게 메시지를 보냈습니다.`);
  };

  const filteredExperts = mockExperts.filter(expert => 
    expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
    expert.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCenters = mockCenters.filter(center =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-blue-600" />
          전문가 바로연결
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'experts' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('experts')}
            className="flex-1"
          >
            <User className="w-4 h-4 mr-2" />
            전문가
          </Button>
          <Button
            variant={activeTab === 'centers' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('centers')}
            className="flex-1"
          >
            <MapPin className="w-4 h-4 mr-2" />
            기술센터
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={activeTab === 'experts' ? '전문가 또는 전문분야 검색...' : '기술센터 또는 지역 검색...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Experts Tab */}
        {activeTab === 'experts' && (
          <div className="space-y-4">
            {selectedExpert ? (
              <div className="space-y-4">
                {/* Expert Detail Header */}
                <div className="flex items-center justify-between">
                  <Button size="sm" variant="outline" onClick={() => setSelectedExpert(null)}>
                    ← 목록으로
                  </Button>
                  <Badge className={getAvailabilityColor(selectedExpert.availability)}>
                    {getAvailabilityText(selectedExpert.availability)}
                  </Badge>
                </div>

                {/* Expert Profile */}
                <div className="flex items-start gap-4">
                  <img
                    src={selectedExpert.image}
                    alt={selectedExpert.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{selectedExpert.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedExpert.title}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{selectedExpert.organization}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(selectedExpert.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {selectedExpert.rating} ({selectedExpert.consultationCount}건)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expert Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-semibold text-blue-600">{selectedExpert.experience}년</p>
                    <p className="text-sm text-blue-600">경력</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-semibold text-green-600">{selectedExpert.responseTime}</p>
                    <p className="text-sm text-green-600">응답시간</p>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="font-medium mb-2">전문 분야</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExpert.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>
                </div>

                {/* Contact Options */}
                <div className="space-y-3">
                  <h4 className="font-medium">상담 방법 선택</h4>
                  <div className="grid gap-2">
                    <Button 
                      className="w-full justify-start" 
                      disabled={selectedExpert.availability === 'offline'}
                      onClick={() => handleCall(selectedExpert.phone, selectedExpert.name)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      전화 상담 ({selectedExpert.phone})
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      disabled={selectedExpert.availability !== 'available'}
                      onClick={() => handleVideoCall(selectedExpert.id, selectedExpert.name)}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      화상 상담
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleMessage(selectedExpert.id, selectedExpert.name)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      메시지 상담
                    </Button>
                  </div>
                </div>

                {/* Additional Info */}
                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">상담 시간 안내</p>
                      <p className="text-sm">• 평일: 09:00 - 18:00</p>
                      <p className="text-sm">• 긴급상황: 24시간 핫라인 1588-9999</p>
                      <p className="text-sm">• 현장방문: 사전 예약 필수</p>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExperts.map((expert) => (
                  <div
                    key={expert.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => setSelectedExpert(expert)}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={expert.image}
                        alt={expert.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{expert.name}</h4>
                          <Badge size="sm" className={getAvailabilityColor(expert.availability)}>
                            {getAvailabilityText(expert.availability)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{expert.title}</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{expert.organization}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(expert.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {expert.rating} • {expert.experience}년 경력
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {expert.specialties.slice(0, 2).map((specialty, index) => (
                            <Badge key={index} size="sm" variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                          {expert.specialties.length > 2 && (
                            <Badge size="sm" variant="outline">
                              +{expert.specialties.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Centers Tab */}
        {activeTab === 'centers' && (
          <div className="space-y-4">
            {selectedCenter ? (
              <div className="space-y-4">
                {/* Center Detail Header */}
                <Button size="sm" variant="outline" onClick={() => setSelectedCenter(null)}>
                  ← 목록으로
                </Button>

                {/* Center Info */}
                <div>
                  <h3 className="font-semibold text-lg">{selectedCenter.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedCenter.address}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{selectedCenter.operatingHours}</span>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4 className="font-medium mb-2">제공 서비스</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCenter.services.map((service, index) => (
                      <Badge key={index} variant="secondary">{service}</Badge>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <h4 className="font-medium">연락처</h4>
                  <div className="grid gap-2">
                    <Button 
                      className="w-full justify-start"
                      onClick={() => handleCall(selectedCenter.phone, selectedCenter.name)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      대표번호: {selectedCenter.phone}
                    </Button>
                    {selectedCenter.emergencyPhone && (
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start"
                        onClick={() => handleCall(selectedCenter.emergencyPhone!, selectedCenter.name)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        긴급연락처: {selectedCenter.emergencyPhone}
                      </Button>
                    )}
                    {selectedCenter.website && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          window.open(selectedCenter.website, '_blank');
                          toast.success('웹사이트를 새 창에서 열었습니다.');
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        웹사이트 방문
                      </Button>
                    )}
                  </div>
                </div>

                {/* Available Experts */}
                {selectedCenter.experts.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">소속 전문가</h4>
                    <div className="space-y-2">
                      {selectedCenter.experts.map((expert) => (
                        <div
                          key={expert.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => setSelectedExpert(expert)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{expert.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{expert.title}</p>
                            </div>
                            <Badge size="sm" className={getAvailabilityColor(expert.availability)}>
                              {getAvailabilityText(expert.availability)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCenters.map((center) => (
                  <div
                    key={center.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => setSelectedCenter(center)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{center.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span>{center.region}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-3 h-3" />
                          <span>{center.phone}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {center.services.slice(0, 3).map((service, index) => (
                            <Badge key={index} size="sm" variant="outline">
                              {service}
                            </Badge>
                          ))}
                          {center.services.length > 3 && (
                            <Badge size="sm" variant="outline">
                              +{center.services.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Emergency Notice */}
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <p className="font-medium text-red-800 dark:text-red-400">긴급상황 시</p>
            <p className="text-sm text-red-700 dark:text-red-300">
              농업 관련 긴급상황 발생 시 24시간 핫라인 <strong>1588-9999</strong>로 연락하세요.
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}