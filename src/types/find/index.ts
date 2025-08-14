export type ResultModalProps = {
  status: 'success' | 'error' | 'info';
  title: string;
  message: string;
  buttonText: string;
  onConfirm: () => void;
};
