import planetImages from '../constants/planetAssets';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';


// ...

const renderGalleryImage = (planetKey: string) => {
  const [planet, index] = planetKey.split('_');
  const list = planetImages[planet];
  if (list && list[index]) {
    return list[index];
  }
  return null;
};

// ...

<View style={styles.photoGrid}>
  {orderedGallery.map((planetKey, index) => (
    <View key={index} style={styles.photoBox}>
      {planetKey === 'unknown' ? (
        <View style={styles.unknownBox}>
          <Text style={styles.unknownText}>
            ここにはどんな{'\n'}惑星が入るかな
          </Text>
        </View>
      ) : (
        <>
          <Image source={renderGalleryImage(planetKey)} style={styles.planetImage} />
          <Text style={styles.planetName}>{planetKey.split('_')[0]}</Text>
        </>
      )}
    </View>
  ))}
</View>
