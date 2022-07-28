const { ipcRenderer } = require("electron");


const getRect = (target) => {
    const rect = target.getBoundingClientRect()
        , res = {}

        ;['bottom', 'left', 'top', 'right', 'height', 'width'].forEach(k => {
            res[k] = Math.floor(rect[k])
        })
    // console.log(prefix, res)
    return res
}

const floatie = (params) =>{
    const name = params.name;
    const target = params.target;

    const bodyDims = getRect(document.body);
    const targetDims = getRect(target);
    console.log(bodyDims);
    console.log(targetDims);
    
    ipcRenderer.send("floatie-show",{bodyDims : bodyDims, targetDims: targetDims})
}

module.exports = floatie;