const prices = [100,200,300]

console.log(prices.map((price,index)=>price*2))
console.log(prices.find((price,index)=>price===200))
console.log(prices.filter((price,index)=>price>100))

const user = {
    name:"Mohit",
    age:24,
    hobbies:["Dancing","Singing","Cricket"]
}
console.log(user.name)
const {name,age,hobbies} = user
console.log(name,age,hobbies)
const result = new Promise((resolve,reject)=>{
    resolve("user Found")
})
result.then((data)=>{
console.log(data)
}).catch((err)=>{
    console.log(err)
})

function getUser(){
    return Promise.resolve("User found")
}

async function main(){
    const user = await getUser();
    console.log(user)
}

main()