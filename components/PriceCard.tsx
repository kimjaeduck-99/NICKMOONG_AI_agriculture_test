import { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  RefreshCw, 
  MapPin,
  Clock,
  AlertCircle
} from 'lucide-react';

interface PriceData {
  emoji: string;
  name: string;
  variety: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  marketName: string;
  grade: string;
  trend: { date: string; value: number; volume?: number }[];
  forecastTrend: 'up' | 'down' | 'stable';
  seasonalityScore: number;
  volatilityIndex: number;
}

const mockPriceData: PriceData[] = [
  {
    emoji: '🌶️',
    name: '고추',
    variety: '건고추 상품',
    price: 25500,
    unit: 'kg',
    change: 150,
    changePercent: 0.59,
    marketName: '대구북부시장',
    grade: '상품',
    forecastTrend: 'up',
    seasonalityScore: 85,
    volatilityIndex: 72,
    trend: [
      { date: '09-06', value: 24800, volume: 450 },
      { date: '09-07', value: 24900, volume: 420 },
      { date: '09-08', value: 25100, volume: 380 },
      { date: '09-09', value: 25000, volume: 510 },
      { date: '09-10', value: 25200, volume: 490 },
      { date: '09-11', value: 25300, volume: 460 },
      { date: '09-12', value: 25500, volume: 430 }
    ]
  },
  {
    emoji: '🧄',
    name: '마늘',
    variety: '깐마늘(국산)',
    price: 8200,
    unit: 'kg',
    change: -200,
    changePercent: -2.38,
    marketName: '서울가락시장',
    grade: '상품',
    forecastTrend: 'down',
    seasonalityScore: 92,
    volatilityIndex: 45,
    trend: [
      { date: '09-06', value: 8500, volume: 820 },
      { date: '09-07', value: 8400, volume: 750 },
      { date: '09-08', value: 8300, volume: 690 },
      { date: '09-09', value: 8250, volume: 710 },
      { date: '09-10', value: 8150, volume: 680 },
      { date: '09-11', value: 8100, volume: 650 },
      { date: '09-12', value: 8200, volume: 720 }
    ]
  },
  {
    emoji: '🧅',
    name: '양파',
    variety: '양파 중품',
    price: 1800,
    unit: 'kg',
    change: 50,
    changePercent: 2.86,
    marketName: '부산엄궁시장',
    grade: '중품',
    forecastTrend: 'stable',
    seasonalityScore: 68,
    volatilityIndex: 38,
    trend: [
      { date: '09-06', value: 1750, volume: 1200 },
      { date: '09-07', value: 1760, volume: 1150 },
      { date: '09-08', value: 1770, volume: 1300 },
      { date: '09-09', value: 1780, volume: 1250 },
      { date: '09-10', value: 1790, volume: 1180 },
      { date: '09-11', value: 1785, volume: 1220 },
      { date: '09-12', value: 1800, volume: 1100 }
    ]
  },
  {
    emoji: '🥬',
    name: '배추',
    variety: '배추 상품',
    price: 2300,
    unit: '포(10kg)',
    change: -100,
    changePercent: -4.17,
    marketName: '광주각화시장',
    grade: '상품',
    forecastTrend: 'down',
    seasonalityScore: 95,
    volatilityIndex: 88,
    trend: [
      { date: '09-06', value: 2450, volume: 980 },
      { date: '09-07', value: 2400, volume: 1050 },
      { date: '09-08', value: 2380, volume: 920 },
      { date: '09-09', value: 2350, volume: 1100 },
      { date: '09-10', value: 2320, volume: 1200 },
      { date: '09-11', value: 2310, volume: 1150 },
      { date: '09-12', value: 2300, volume: 1250 }
    ]
  },
  {
    emoji: '🍅',
    name: '토마토',
    variety: '토마토 완숙',
    price: 4500,
    unit: 'kg',
    change: 200,
    changePercent: 4.65,
    marketName: '대전오정시장',
    grade: '상품',
    forecastTrend: 'up',
    seasonalityScore: 77,
    volatilityIndex: 65,
    trend: [
      { date: '09-06', value: 4200, volume: 620 },
      { date: '09-07', value: 4250, volume: 580 },
      { date: '09-08', value: 4300, volume: 640 },
      { date: '09-09', value: 4350, volume: 590 },
      { date: '09-10', value: 4400, volume: 610 },
      { date: '09-11', value: 4450, volume: 570 },
      { date: '09-12', value: 4500, volume: 550 }
    ]
  },
  {
    emoji: '🥒',
    name: '오이',
    variety: '취청오이',
    price: 3200,
    unit: 'kg',
    change: 80,
    changePercent: 2.56,
    marketName: '인천구월시장',
    grade: '상품',
    forecastTrend: 'stable',
    seasonalityScore: 73,
    volatilityIndex: 55,
    trend: [
      { date: '09-06', value: 3100, volume: 480 },
      { date: '09-07', value: 3120, volume: 460 },
      { date: '09-08', value: 3140, volume: 500 },
      { date: '09-09', value: 3160, volume: 520 },
      { date: '09-10', value: 3180, volume: 490 },
      { date: '09-11', value: 3190, volume: 470 },
      { date: '09-12', value: 3200, volume: 510 }
    ]
  },
  {
    emoji: '🌽',
    name: '옥수수',
    variety: '찰옥수수',
    price: 5800,
    unit: 'kg',
    change: -150,
    changePercent: -2.52,
    marketName: '수원농수산물시장',
    grade: '상품',
    forecastTrend: 'down',
    seasonalityScore: 89,
    volatilityIndex: 42,
    trend: [
      { date: '09-06', value: 6000, volume: 320 },
      { date: '09-07', value: 5950, volume: 340 },
      { date: '09-08', value: 5900, volume: 310 },
      { date: '09-09', value: 5850, volume: 330 },
      { date: '09-10', value: 5820, volume: 290 },
      { date: '09-11', value: 5810, volume: 300 },
      { date: '09-12', value: 5800, volume: 280 }
    ]
  }
];

const getVolatilityColor = (index: number) => {
  if (index >= 80) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  if (index >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
  return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
};

const getSeasonalityColor = (score: number) => {
  if (score >= 90) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
  if (score >= 70) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
};

export function PriceCard() {
  const [selectedItem, setSelectedItem] = useState<PriceData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  // 자동 업데이트 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // 30초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            가격: {formatPrice(payload[0].value)}원
          </p>
          {payload[0].payload.volume && (
            <p className="text-gray-600 text-sm">
              거래량: {payload[0].payload.volume}톤
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            실시간 농산물 시세
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              LIVE
            </Badge>
            <Button size="sm" variant="outline" onClick={() => setLastUpdated(new Date())}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>최종 업데이트: {formatTime(lastUpdated)}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="overview">시세 현황</TabsTrigger>
            <TabsTrigger value="detailed">상세 분석</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3">
            {mockPriceData.slice(0, 5).map((item, index) => (
              <div 
                key={index} 
                className="space-y-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.variety} • {item.marketName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatPrice(item.price)}원/{item.unit}
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      item.change > 0 ? 'text-red-500' : item.change < 0 ? 'text-blue-500' : 'text-gray-500'
                    }`}>
                      {item.change > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : item.change < 0 ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : null}
                      <span>
                        {item.change > 0 ? '+' : ''}{item.change} ({item.changePercent > 0 ? '+' : ''}{item.changePercent}%)
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Mini trend chart */}
                <div className="h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={item.trend}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={item.change > 0 ? "#ef4444" : item.change < 0 ? "#3b82f6" : "#6b7280"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Forecast indicator */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge size="sm" className={getVolatilityColor(item.volatilityIndex)}>
                      변동성 {item.volatilityIndex}
                    </Badge>
                    <Badge size="sm" className={getSeasonalityColor(item.seasonalityScore)}>
                      계절성 {item.seasonalityScore}
                    </Badge>
                  </div>
                  <div className={`flex items-center gap-1 ${
                    item.forecastTrend === 'up' ? 'text-red-500' : 
                    item.forecastTrend === 'down' ? 'text-blue-500' : 'text-gray-500'
                  }`}>
                    {item.forecastTrend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                     item.forecastTrend === 'down' ? <TrendingDown className="w-3 h-3" /> : 
                     <div className="w-3 h-0.5 bg-gray-400 rounded"></div>}
                    <span>
                      {item.forecastTrend === 'up' ? '상승예상' : 
                       item.forecastTrend === 'down' ? '하락예상' : '보합예상'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            {selectedItem ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedItem.emoji}</span>
                    <div>
                      <h3 className="font-semibold">{selectedItem.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedItem.variety} • {selectedItem.grade}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setSelectedItem(null)}>
                    전체 보기
                  </Button>
                </div>

                {/* Detailed Chart */}
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedItem.trend}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Market Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-sm">시장 정보</span>
                      </div>
                      <p className="text-sm">{selectedItem.marketName}</p>
                      <p className="text-xs text-gray-500 mt-1">등급: {selectedItem.grade}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium text-sm">위험도 분석</span>
                      </div>
                      <p className="text-sm">변동성: {selectedItem.volatilityIndex}/100</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedItem.volatilityIndex >= 80 ? '높음' : 
                         selectedItem.volatilityIndex >= 60 ? '보통' : '낮음'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Trading Volume */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">7일 거래량 추이</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedItem.trend.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>{item.date}</span>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 rounded-full ${
                              item.volume && item.volume > 500 ? 'bg-green-500' : 'bg-gray-300'
                            }`} style={{ width: `${(item.volume || 0) / 10}px` }}></div>
                            <span>{item.volume}톤</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  품목을 선택하면 상세 분석을 확인할 수 있습니다
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>출처: 농산물유통정보(KAMIS)</span>
            <span>실시간 연동</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}