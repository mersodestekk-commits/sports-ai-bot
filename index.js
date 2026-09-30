import { Bot } from "grammy";
import OpenAI from "openai";
const telegramToken=process.env.TELEGRAM_BOT_TOKEN;
const openaiKey=process.env.OPENAI_API_KEY;
if(!telegramToken) throw new Error("TELEGRAM_BOT_TOKEN eksik.");
if(!openaiKey) throw new Error("OPENAI_API_KEY eksik.");
const bot=new Bot(telegramToken);
const openai=new OpenAI({apiKey:openaiKey});
const instructions=`Sen Türkçe konuşan bir AI spor analiz asistanısın. Futbol, basketbol ve diğer sporları analiz edersin. Gerçek zamanlı spor verisine sahip değilsen güncel fikstür, sakatlık, oran veya istatistik uydurma. Bahis ve kupon sorularında garanti vermeden olasılık ve riski açıkla. Bu ilk sürümde harici canlı spor veri API'si henüz bağlı değil; güncel veri gerektiren sorularda bunu belirt.`;
bot.command("start",ctx=>ctx.reply("🏆 AI Spor Analiz Botu aktif!\n\n⚽ Futbol\n🏀 Basketbol\n📊 Maç analizi\n🎯 Skor senaryoları\n🧠 AI yorumları\n\nBana bir spor sorusu yazabilirsin.\n\nℹ️ İlk sürümde canlı spor veri kaynağı henüz bağlı değildir."));
bot.on("message:text",async ctx=>{
 if(ctx.message.text.startsWith("/")) return;
 await ctx.replyWithChatAction("typing");
 try{
  const r=await openai.responses.create({model:"gpt-5.6-luna",reasoning:{effort:"low"},instructions,input:ctx.message.text});
  const a=r.output_text?.trim()||"Şu anda yanıt oluşturamadım.";
  for(let i=0;i<a.length;i+=3900) await ctx.reply(a.slice(i,i+3900));
 }catch(e){console.error(e);await ctx.reply("❌ AI yanıtı oluşturulamadı. API anahtarını, API bakiyesini ve Railway loglarını kontrol et.");}
});
bot.catch(e=>console.error("Bot hatası:",e.error));
console.log("🤖 Sports AI Bot başlatılıyor...");
bot.start({onStart:i=>console.log(`✅ @${i.username} aktif.`)});
