// Static image map — React Native requires static requires (no dynamic paths)
// Maps recipe IDs to local assets in assets/recipes/
const recipeImages: Record<string, any> = {
  ld001: require('../assets/recipes/ld001_butter_paneer_masala.jpg'),
  ld002: require('../assets/recipes/ld002_kadhai_paneer.jpg'),
  ld003: require('../assets/recipes/ld003_soya_masala.jpg'),
  ld004: require('../assets/recipes/ld004_rajma_chawal.jpg'),
  ld005: require('../assets/recipes/ld005_kadi_chawal.jpg'),
  ld006: require('../assets/recipes/ld006_dal_chawal.jpg'),
  ld007: require('../assets/recipes/ld007_sev_tamatar.jpg'),
  ld008: require('../assets/recipes/ld008_chole.jpg'),
  ld009: require('../assets/recipes/ld009_sprouts_ki_sabji.jpg'),
  ld010: require('../assets/recipes/ld010_paneer_ghee_roast.jpg'),
  ld011: require('../assets/recipes/ld011_bhindi.jpg'),
  ld012: require('../assets/recipes/ld012_cluster_beans.jpg'),
  ld013: require('../assets/recipes/ld013_methi_malai_paneer.jpg'),
  ld014: require('../assets/recipes/ld014_baingan_bharta.jpg'),
  ld015: require('../assets/recipes/ld015_paneer_bhurji.jpg'),
  ld016: require('../assets/recipes/ld016_jeera_aloo.jpg'),
  ld017: require('../assets/recipes/ld017_veg_pulao.jpg'),
  ld018: require('../assets/recipes/ld018_dum_aloo.jpg'),
  ld019: require('../assets/recipes/ld019_kala_chana.jpg'),
  ld022: require('../assets/recipes/ld022_dal_makhani.jpg'),
  ld023: require('../assets/recipes/ld023_vegetable_khichdi.jpg'),
  ld024: require('../assets/recipes/ld024_matar_paneer.jpg'),
  ld025: require('../assets/recipes/ld025_besan_gatta.jpg'),
  ld026: require('../assets/recipes/ld026_thepla.jpg'),
};

export default recipeImages;
