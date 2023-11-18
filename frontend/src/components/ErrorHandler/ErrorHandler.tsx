import styles from "./ErrorHandler.module.css";

interface IErrorHandler {
  message: string;
}

const ErrorHandler = ({ message }: IErrorHandler) => {
  return <div className={styles.errorHandler}>{message}</div>;
};

export default ErrorHandler;
