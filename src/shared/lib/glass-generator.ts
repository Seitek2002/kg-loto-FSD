export function generateGlassMap(
  width: number,
  height: number,
  bezel: number = 20,
): string {
  if (typeof window === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Центры для левого и правого круга капсулы
  const radius = height / 2;
  const leftCenterX = radius;
  const rightCenterX = width - radius;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let vectorX = 0;
      let vectorY = 0;
      let dist = 0;

      // 1. ОПРЕДЕЛЯЕМ ГЕОМЕТРИЮ (Капсула/Пилюля)

      // Левый полукруг
      if (x < leftCenterX) {
        const dx = x - leftCenterX;
        const dy = y - radius;
        dist = Math.sqrt(dx * dx + dy * dy);
        // Нормализуем вектор (от -1 до 1)
        if (dist > 0) {
          vectorX = dx / dist;
          vectorY = dy / dist;
        }
      }
      // Правый полукруг
      else if (x > rightCenterX) {
        const dx = x - rightCenterX;
        const dy = y - radius;
        dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          vectorX = dx / dist;
          vectorY = dy / dist;
        }
      }
      // Центральная часть (прямая)
      else {
        // Здесь изгиб идет только по вертикали (Y)
        const dy = y - radius;
        dist = Math.abs(dy); // Расстояние от центральной линии
        vectorX = 0;
        vectorY = dy / radius; // -1 сверху, 1 снизу
      }

      // 2. ВЫЧИСЛЯЕМ ФАСКУ (Bezel) - Искажение только по краям
      // Мы инвертируем расстояние: 1 на краю, 0 в центре
      // Но для "фаски" нам нужно искажение только на последних N пикселях

      // Расстояние до ближайшего края капсулы
      let distToEdge = 0;
      if (x < leftCenterX)
        distToEdge =
          radius -
          Math.sqrt(Math.pow(x - leftCenterX, 2) + Math.pow(y - radius, 2));
      else if (x > rightCenterX)
        distToEdge =
          radius -
          Math.sqrt(Math.pow(x - rightCenterX, 2) + Math.pow(y - radius, 2));
      else distToEdge = Math.min(y, height - y);

      // Сила искажения (кривая профиля стекла)
      let intensity = 0;

      if (distToEdge < bezel) {
        // Мы на краю стекла (фаска)
        // 0 на самом краю, 1 внутри
        const t = distToEdge / bezel;
        // Используем косинус для плавного изгиба стекла
        intensity = Math.cos((t * Math.PI) / 2);
      }

      // 3. ЗАПИСЫВАЕМ В ЦВЕТ (Red = X, Green = Y)
      // SVG ожидает: 0 = сдвиг влево/вверх, 128 = нет сдвига, 255 = сдвиг вправо/вниз

      const r = 128 + vectorX * intensity * 127;
      const g = 128 + vectorY * intensity * 127;

      // Альфа-канал используем для карты высот (для Specular Lighting)
      // const alpha = intensity * 255;

      const i = (y * width + x) * 4;
      data[i] = r; // R -> X Displacement
      data[i + 1] = g; // G -> Y Displacement
      data[i + 2] = 255; // B (не важно)
      data[i + 3] = 255; // Alpha (полная непрозрачность для карты)
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}
