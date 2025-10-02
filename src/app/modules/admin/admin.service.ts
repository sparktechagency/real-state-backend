import { USER_ROLES } from "../../../enums/user";
import QueryBuilder from "../../builder/QueryBuilder"
import { User } from "../user/user.model"

const getAllUsersFromDB = async (query: Record<string, any>) => {
    const result = new QueryBuilder(User.find({ verified: true, role: USER_ROLES.AGENCY }), query)
        .filter()
        .sort()
        .paginate();
    const data = await result.modelQuery;
    const paginationInfo = await result.getPaginationInfo();
    if (!data) {
        return { data: [], meta: {} };
    }
    return {
        data,
        paginationInfo
    };
}
export const adminService = {
    getAllUsersFromDB
}

