import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk"

export default function useKakaoLoader() {
    useKakaoLoaderOrigin({
        appkey: process.env.REACT_APP_KAKAO_MAP_KEY as string,
        libraries: ["clusterer", "drawing", "services"],
    })
}