import {getSysName} from '@/api/public'

export function getSystemNameAsync() {
    return new Promise((resolve,reject)=>{
        getSysName().then(res=>{
            localStorage.setItem('system_name',res.data);
            resolve(res.data)
        })
    })
}
