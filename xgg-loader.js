const fs = require('fs')
const path = require('path')
const Router = require('koa-router')

//读取指定目录文件
function load(dir, cb){
    //获取绝对路径
    const url = path.resolve(__dirname, dir)

    //读文件
    const files = fs.readdirSync(url)

    files.forEach(filename=>{
        filename = filename.replace('.js','')
        const file = require(url+'/'+filename)
        //处理逻辑
        cb(filename, file)
    })
}

function initRouter(app){
    const router = new Router()
    load('routes',(filename, routes)=>{
        const prefix = filename === 'index' ? '' : `/${filename}`

        routes = typeof routes === "function"? routes(app) : routes
        //遍历对象
        Object.keys(routes).forEach(route=>{
            const [method, path] = route.split(' ')
            // console.log(`正在映射地址： ${method.toLocaleUpperCase()} ${prefix} ${path}`)

            router[method](prefix+path, routes[route])
        })
    })
    return router;
}

function initController(app){
    let controllers = {}
    load('controller',(filename, controller)=>{
        controller = typeof controller === "function"? controller(app) : controller
        controllers[filename] = controller
    })
    return controllers;
}

function initService(){
    let services = {}
    load('service',(filename, service)=>{
        //遍历对象
        services[filename] = service
    })
    return services;
}

const Sequelize = require('sequelize')
function loadConfig(app){
    load('config',(filename, conf)=>{
        if(conf.db){
            app.$db = new Sequelize(conf.db)

            //加载模型
            app.$model = {}
            load('model',(filename, {schema, options})=>{
                app.$model[filename] = app.$db.define(filename, schema, options)
            })
            app.$db.sync()   //同步到数据库
        }
        if(conf.middware){
            conf.middware.forEach(mid=>{
                const midPath = path.resolve(__dirname,'middleware',mid)
                app.$app.use(require(midPath))
            })
        }
    })
}

const schedule = require('node-schedule')
function initSchedule(){
    load('schedule',(filename, scheduleConfig)=>{
        schedule.scheduleJob(scheduleConfig.interval, scheduleConfig.handler)
    })
}
module.exports = {
    initRouter, initController, initService, loadConfig, initSchedule
}