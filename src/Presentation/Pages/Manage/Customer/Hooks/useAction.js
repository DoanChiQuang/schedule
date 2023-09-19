import { create, getAll, remove, update } from "../../../../Api/customer"
import useApi from "../../../../Hooks/useApi"

const useAction = () => {

    const { data: dataGetAll, loading: loadingGetAll, error: errorGetAll, message: messageGetAll, request: requestGetAll } = useApi(getAll);
    const { data: dataCreate, loading: loadingCreate, error: errorCreate, message: messageCreate, request: requestCreate } = useApi(create);
    const { data: dataUpdate, loading: loadingUpdate, error: errorUpdate, message: messageUpdate, request: requestUpdate } = useApi(update);
    const { data: dataRemove, loading: loadingRemove, error: errorRemove, message: messageRemove, request: requestRemove } = useApi(remove);

    const cusGetAll = () => {
        requestGetAll()
    }
}
