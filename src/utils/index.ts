export const getUrlWithoutPart = (url: string, partNotNeed: string): string => {
  const lastPartUrlArray = url.split(partNotNeed)
  return lastPartUrlArray.filter((pathUrl: string) => pathUrl.length)[0] || ''
};

