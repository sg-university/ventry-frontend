import {useEffect, useState} from "react";
import Role from "@/models/entities/role";
import RoleService from "@/services/role_service";
import Content from "@/models/value_objects/contracts/content";

function Home() {
    const [data, setData] = useState<Role[]>([])

    useEffect(() => {
        const roleService = new RoleService()
        roleService
            .readAll()
            .then((response) => {
                const content: Content<Role[]> = response.data
                setData(content.data)
            })
    }, [])

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {
                    data.map((role: Role, index: number) => {
                        return (
                            <tr key={index}>
                                <td>{role.id}</td>
                                <td>{role.name}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </>
    )
}


export default Home
