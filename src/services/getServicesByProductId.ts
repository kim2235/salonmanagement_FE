import {createSelector} from "reselect";
import {RootState} from "../redux/store";
import {ServiceProductUsed} from "../types/Service";

export const getServicesByProductId = createSelector(
    (state: RootState, productId: number) => productId, // Input selector for productId
    (state: RootState) => state.services.valueService, // Input selector for services state
    (productId, valueService) => {
        // Logic to filter services by productId
        const allServices = Object.values(valueService).flat();
        return allServices.filter(service =>
            service.serviceProductUsed?.some((product: ServiceProductUsed) => product.id === productId)
        );
    }
);
