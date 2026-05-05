import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, StyleSheet, StatusBar, Alert } from 'react-native';

const BACKEND_URL = 'https://supreme-couscous-6979rj6vg7qxf4p4g-3000.app.github.dev';

function AssetCard({ asset }) {
  const isPositive = asset.changePercent >= 0;
  const changeColor = isPositive ? '#00d4aa' : '#ff4d6d';
  const arrow = isPositive ? '▲' : '▼';
  const categoryColors = { ETF: '#3b82f6', CEDEAR: '#8b5cf6', Bono: '#f59e0b', Acción: '#10b981' };
  const categoryColor = categoryColors[asset.category] || '#6b7280';
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
          <Text style={styles.symbol}>{asset.symbol.replace('.BA','')}</Text>
          <View style={[styles.badge,{backgroundColor:categoryColor+'30',borderColor:categoryColor}]}>
            <Text style={[styles.badgeText,{color:categoryColor}]}>{asset.category}</Text>
          </View>
        </View>
        <Text style={styles.allocation}>{asset.allocation}%</Text>
      </View>
      <Text style={styles.assetName}>{asset.name}</Text>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={styles.price}>{asset.currency==='ARS'?'$':'USD '}{asset.currentPrice?.toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2})}</Text>
        <View style={[styles.changeContainer,{backgroundColor:changeColor+'20'}]}>
          <Text style={[styles.change,{color:changeColor}]}>{arrow} {Math.abs(asset.changePercent).toFixed(2)}%</Text>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadPrices = useCallback(async (isRefresh=false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/prices`);
      const data = await res.json();
      if (data.success) { setAssets(data.data); setLastUpdate(new Date()); }
    } catch (err) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  const up = assets.filter(a=>a.changePercent>0).length;
  const down = assets.filter(a=>a.changePercent<0).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e"/>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>📈 Inversión IA</Text>
          <Text style={styles.headerSubtitle}>{lastUpdate?`Actualizado ${lastUpdate.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}`:'Presioná ACTUALIZAR'}</Text>
        </View>
        <TouchableOpacity style={[styles.updateButton,loading&&{opacity:0.6}]} onPress={()=>loadPrices()} disabled={loading}>
          {loading?<ActivityIndicator size="small" color="#fff"/>:<Text style={styles.updateButtonText}>⟳ ACTUALIZAR</Text>}
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{padding:16,paddingBottom:40}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>loadPrices(true)} tintColor="#3b82f6"/>}>
        {assets.length===0&&!loading&&(
          <View style={{alignItems:'center',paddingVertical:60}}>
            <Text style={{fontSize:64,marginBottom:16}}>📊</Text>
            <Text style={{fontSize:24,fontWeight:'700',color:'#fff',marginBottom:12}}>Bienvenido, Oscar</Text>
            <Text style={{fontSize:15,color:'#64748b',textAlign:'center',lineHeight:24,marginBottom:32}}>Presioná ACTUALIZAR para ver{'\n'}los precios de tus 9 activos</Text>
            <TouchableOpacity style={styles.updateButton} onPress={()=>loadPrices()}>
              <Text style={styles.updateButtonText}>⟳ Cargar precios</Text>
            </TouchableOpacity>
          </View>
        )}
        {assets.length>0&&(
          <View style={styles.summary}>
            <Text style={{fontSize:12,color:'#64748b',fontWeight:'600',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>📊 Mi Cartera · Oscar</Text>
            <View style={{flexDirection:'row',paddingTop:8,gap:20}}>
              <View style={{alignItems:'center'}}><Text style={{fontSize:20,fontWeight:'700',color:'#00d4aa'}}>▲ {up}</Text><Text style={{fontSize:11,color:'#64748b'}}>subieron</Text></View>
              <View style={{alignItems:'center'}}><Text style={{fontSize:20,fontWeight:'700',color:'#ff4d6d'}}>▼ {down}</Text><Text style={{fontSize:11,color:'#64748b'}}>bajaron</Text></View>
              <View style={{alignItems:'center'}}><Text style={{fontSize:20,fontWeight:'700',color:'#fff'}}>{assets.length}</Text><Text style={{fontSize:11,color:'#64748b'}}>activos</Text></View>
            </View>
            <Text style={{fontSize:12,color:'#334155',marginTop:12}}>🎯 Meta: jubilación en 20 años</Text>
          </View>
        )}
        {assets.map(asset=>(<AssetCard key={asset.id} asset={asset}/>))}
        {assets.length>0&&<Text style={{fontSize:12,color:'#334155',textAlign:'center',marginTop:16}}>Tirá hacia abajo para actualizar · Próximamente: RSI, MACD, IA 🤖</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#0a0f1e'},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,paddingTop:55,paddingBottom:15,borderBottomWidth:1,borderBottomColor:'#1e2a3a'},
  headerTitle:{fontSize:22,fontWeight:'700',color:'#fff'},
  headerSubtitle:{fontSize:12,color:'#64748b',marginTop:2},
  updateButton:{backgroundColor:'#3b82f6',paddingHorizontal:16,paddingVertical:10,borderRadius:10,alignItems:'center'},
  updateButtonText:{color:'#fff',fontWeight:'700',fontSize:13},
  summary:{backgroundColor:'#0d1526',borderRadius:16,padding:20,marginBottom:20,borderWidth:1,borderColor:'#1e2a3a'},
  card:{backgroundColor:'#0d1526',borderRadius:14,padding:16,marginBottom:10,borderWidth:1,borderColor:'#1e2a3a'},
  cardHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:6},
  symbol:{fontSize:18,fontWeight:'800',color:'#fff'},
  badge:{paddingHorizontal:8,paddingVertical:3,borderRadius:6,borderWidth:1},
  badgeText:{fontSize:11,fontWeight:'600'},
  allocation:{fontSize:18,fontWeight:'700',color:'#fff'},
  assetName:{fontSize:13,color:'#94a3b8',marginBottom:10},
  price:{fontSize:22,fontWeight:'700',color:'#fff'},
  changeContainer:{paddingHorizontal:10,paddingVertical:5,borderRadius:8},
  change:{fontSize:14,fontWeight:'700'},
});
