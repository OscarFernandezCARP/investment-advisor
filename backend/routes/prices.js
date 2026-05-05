const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const PORTFOLIO_PATH = path.join(__dirname, '../data/portfolio.json');
const MOCK = {'SPY':{price:523.45,change:2.31,pct:0.44,cur:'USD'},'XLP':{price:78.92,change:-0.18,pct:-0.23,cur:'USD'},'XLV':{price:142.67,change:1.05,pct:0.74,cur:'USD'},'XLF':{price:47.33,change:0.55,pct:1.18,cur:'USD'},'NU':{price:14.82,change:0.22,pct:1.51,cur:'USD'},'TZX28.BA':{price:98500,change:450,pct:0.46,cur:'ARS'},'AL30.BA':{price:67800,change:-200,pct:-0.29,cur:'ARS'},'YPFD.BA':{price:42300,change:850,pct:2.05,cur:'ARS'},'GGAL.BA':{price:8950,change:120,pct:1.36,cur:'ARS'}};
router.get('/', (req, res) => {
  const p = JSON.parse(fs.readFileSync(PORTFOLIO_PATH,'utf8'));
  const data = p.assets.map(a => {const m=MOCK[a.symbol]||{price:0,change:0,pct:0,cur:'USD'};return{...a,currentPrice:m.price,change:m.change,changePercent:m.pct,currency:m.cur,totalValue:(a.quantity||0)*m.price,gainLoss:a.purchasePrice>0?((m.price-a.purchasePrice)/a.purchasePrice)*100:0};});
  res.json({success:true,data,cached:false});
});
router.post('/update-holdings',(req,res)=>{
  const{symbol,quantity,purchasePrice}=req.body;
  const p=JSON.parse(fs.readFileSync(PORTFOLIO_PATH,'utf8'));
  const i=p.assets.findIndex(a=>a.symbol===symbol);
  if(i===-1)return res.status(404).json({success:false,error:'No encontrado'});
  p.assets[i].quantity=parseFloat(quantity)||0;
  p.assets[i].purchasePrice=parseFloat(purchasePrice)||0;
  fs.writeFileSync(PORTFOLIO_PATH,JSON.stringify(p,null,2));
  res.json({success:true});
});
module.exports = router;