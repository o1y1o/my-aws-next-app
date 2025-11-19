"use client"; // Next.jsでボタン操作などを行う場合に必須の行

import { useState } from "react";

export default function Home() {
  // ▼▼ ここをあなたのAPI Gateway URLに書き換えてください ▼▼
  const MY_API_URL = "https://vkgf1vus3i.execute-api.ap-northeast-1.amazonaws.com/default/my-first-scheduler"; 
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

  const [message, setMessage] = useState<string>("（まだLambdaを呼び出していません）");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const callLambda = async () => {
    setIsLoading(true);
    setMessage("Lambdaに接続中...");
    
    try {
      // Lambdaに送るデータ
      const eventData = { "who": "Next.js User" };
      
      const response = await fetch(MY_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Lambdaからの返事（return body）を受け取る
      const responseData = await response.json();
      setMessage(responseData);

    } catch (error) {
      console.error(error);
      setMessage("エラーが発生しました。API GatewayのCORS設定が必要かもしれません。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>AWS Lambda 連携テスト</h1>
      
      <div style={{ margin: "30px 0" }}>
        <button 
          onClick={callLambda} 
          disabled={isLoading}
          style={{ 
            padding: "15px 30px", 
            fontSize: "16px", 
            cursor: isLoading ? "not-allowed" : "pointer",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          {isLoading ? "通信中..." : "Lambdaを呼び出す"}
        </button>
      </div>

      <div style={{ 
        padding: "20px", 
        border: "1px solid #eaeaea", 
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        display: "inline-block",
        minWidth: "300px"
      }}>
        <strong>結果:</strong>
        <p style={{ color: "#333", marginTop: "10px", fontWeight: "bold" }}>
          {message}
        </p>
      </div>
    </main>
  );
}