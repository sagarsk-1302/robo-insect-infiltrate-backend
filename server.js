const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/api/hello", (req, res) => {
    res.status(200).send("Hello Sagar!");
});

const parseInsectData = (commands)=>{
    const commandList =commands.split("\n")
    if(commandList.length==0 || commandList.length%2==1){
        return null
    }
    const mappedCmds = []
    for(let i=0;i<commandList.length;i+=2){
        const [row,column,direction] = commandList[i].split(" ");
        mappedCmds.push({position:{
            row,column,direction
        },commands:commandList[i+1]})
    }
    return mappedCmds;
}                       
const processData = (data)=>{
    const {row,column,commands} = data
    const mappendCmds = parseInsectData(commands)
    if(mappendCmds== null){
        return null;
    }
    return mappendCmds.map(insectData =>{
        let rowPosition = parseInt(insectData.position.row)
        let columnPosition = parseInt(insectData.position.column)
        let direction = insectData.position.direction
        const cmds = insectData.commands.split("")
        for(let cmd of cmds){
            if(cmd==="F"){
                [rowPosition,columnPosition] = operate(direction, rowPosition,columnPosition )
            }else{
                direction = turn(direction, cmd)
            }
        }
        return [rowPosition,columnPosition,direction]
    })
}
const operate = (direction, rowPosition,columnPosition)=>{
    switch(direction){
        case "W": 
            rowPosition+=1;
            break;
        case "E":
            rowPosition-=1
            break;
        case "N":
            columnPosition+=1;
            break
        case "S":
            columnPosition-=1;
            break;
        default: null
    }
    return [rowPosition,columnPosition]
}

const turn = (direction, cmd)=>{
    if(cmd==="L"){
        switch(direction){
            case "N": return "W";
            case "E": return "N";
            case "S": return "E";
            case "W": return "S";
        }
    }else{
        switch(direction){
            case "N": return "E";
            case "E": return "S";
            case "S": return "W";
            case "W": return "N";
        } 
    }
}
// res.status(200).send("Hello Sagar!");
app.post("/getpath",(req,res)=>{
    console.log(req.body);
    const result = processData(req.body)
    res.status(200).send(JSON.stringify({result}))
    
});


const PORT = process.env.PORT || 5000;
  
app.listen(PORT, console.log(`Server started on port ${PORT}`));
