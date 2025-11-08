import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export type ImageLightboxProps = {
  open: boolean;
  onClose: () => void;
  images: string[];
};

const ImageLightbox = ({ open, images, onClose }: ImageLightboxProps) => {
  return (
    <Lightbox
      open={open}
      close={onClose}
      slides={images.map((src: string) => ({ src }))}
      controller={{ closeOnBackdropClick: true }} // 배경 클릭 시 닫기
    />
  );
};

export default ImageLightbox;
