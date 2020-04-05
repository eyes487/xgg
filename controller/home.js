module.exports = app =>({
    index: async ctx=>{
        // ctx.body = await app.$model.users.findAll()
        const name = await app.$service.user.getName()
        ctx.body = "ctrl "+ name
    },
    detail: async ctx=>{
        const name = await app.$service.user.getName()
        const age = await app.$service.user.getAge()
        ctx.body = "姓名: "+ name +'  年龄: ' + age
    }
})