import { Provider } from "react-redux";
import { store } from "../stores/store";
function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;
