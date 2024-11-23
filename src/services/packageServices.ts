import {RootState} from "../redux/store";
export const selectPackageById = (state: RootState, id: string) => state.packages.valuePackage[id] || [];
