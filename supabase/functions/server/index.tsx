import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-6ba9087f/health", (c) => {
  return c.json({ status: "ok" });
});

// AI Chat endpoint using Google Gemini API
app.post("/make-server-6ba9087f/ai-chat", async (c) => {
  try {
    const { message, context } = await c.req.json();
    
    if (!message) {
      return c.json({ error: "Message is required" }, 400);
    }

    const apiKey = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!apiKey) {
      console.log("Google AI API key not found in environment variables");
      return c.json({ 
        error: "AI service is not configured. Please set up Google AI API key.",
        details: "GOOGLE_AI_API_KEY environment variable is missing"
      }, 500);
    }

    // Google Gemini API 호출
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    // 농업 전용 프롬프트 구성
    const systemPrompt = `당신은 전문 농업 AI 어시스턴트입니다. 다음 지침을 따라 답변해주세요:

1. 한국의 농업 환경과 기후를 고려한 답변 제공
2. 작물별 재배 방법, 병해충 방제, 시비 방법 등 실용적인 정보 제공
3. 농약 사용 시 안전 기준과 잔류 허용 기준 준수 강조
4. 친환경 농업 방법 우선 제안
5. 전문적이지만 농부가 이해하기 쉬운 용어로 설명
6. 필요시 관련 기관(농촌진흥청, 농업기술센터 등) 문의 권장

현재 컨텍스트: ${context || '일반 농업 상담'}

사용자 질문: ${message}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: systemPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Google AI API error: ${response.status} - ${errorText}`);
      return c.json({ error: "Failed to get AI response" }, 500);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.log("Invalid response format from Google AI API:", data);
      return c.json({ error: "Invalid response from AI service" }, 500);
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    
    // 응답을 KV store에 로깅 (선택사항)
    const logKey = `chat_log_${Date.now()}`;
    await kv.set(logKey, {
      question: message,
      answer: aiResponse,
      timestamp: new Date().toISOString(),
      context: context || null
    });

    return c.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.log("AI Chat endpoint error:", error);
    return c.json({ error: "Internal server error during AI processing" }, 500);
  }
});

// 작물별 특화 AI 진단 endpoint
app.post("/make-server-6ba9087f/ai-diagnose", async (c) => {
  try {
    const { crop, purpose, symptoms, imageData } = await c.req.json();
    
    if (!crop || !purpose) {
      return c.json({ error: "Crop and purpose are required" }, 400);
    }

    const apiKey = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!apiKey) {
      return c.json({ error: "AI service is not configured" }, 500);
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    // 작물별 특화 진단 프롬프트
    const diagnosisPrompt = `당신은 ${crop} 전문 진단 AI입니다.

진단 목적: ${purpose}
증상 설명: ${symptoms || '사용자가 제공한 정보 없음'}

다음 형식으로 답변해주세요:

## 🔍 진단 결과
[가능성이 높은 문제점들]

## 🌡️ 원인 분석
[주요 원인들과 환경 요인]

## 💊 해결 방법
[단계별 처방 및 방제 방법]

## ⚠️ 주의사항
[안전 수칙 및 예방책]

## 📞 추가 도움
[필요시 전문기관 연락처]

한국 농업 환경에 맞는 실용적이고 구체적인 답변을 제공해주세요.`;

    const requestBody = {
      contents: [{
        parts: [{
          text: diagnosisPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.3, // 진단은 더 정확성을 위해 낮은 temperature
        topK: 20,
        topP: 0.8,
        maxOutputTokens: 2048,
      }
    };

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Google AI API error in diagnosis: ${response.status} - ${errorText}`);
      return c.json({ error: "Failed to get diagnosis" }, 500);
    }

    const data = await response.json();
    const diagnosis = data.candidates[0].content.parts[0].text;
    
    // 진단 결과를 저장
    const diagnosisKey = `diagnosis_${crop}_${Date.now()}`;
    await kv.set(diagnosisKey, {
      crop,
      purpose,
      symptoms,
      diagnosis,
      timestamp: new Date().toISOString()
    });

    return c.json({ 
      diagnosis,
      crop,
      purpose,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.log("AI Diagnosis endpoint error:", error);
    return c.json({ error: "Internal server error during diagnosis" }, 500);
  }
});

Deno.serve(app.fetch);