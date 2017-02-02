import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import io from 'socket.io-client';
let socket = null,
    mssg=[];
export default class Form extends React.Component{
  constructor(props) {
    super(props);
    this.state = {sender:"",channelID:"",msg:"",messgeDisplay:[],channel:""};
    this.senderHandleChange=this.senderHandleChange.bind(this);
    this.channelIDHandleChange=this.channelIDHandleChange.bind(this);
    this.msgHandleChange=this.msgHandleChange.bind(this);
    this.handleClick=this.handleClick.bind(this);
    this.listenHandleClick=this.listenHandleClick.bind(this);
    this.handleChange=this.handleChange.bind(this);
  }
  componentDidMount() {
    socket = io('http://localhost:8000');
    let that=this;
    socket.on("receive message",function(msg){
      console.log(msg);
      console.log("received message + msg : ", msg.sender);
      var message=msg;
      mssg.push(message);
      that.setState({messgeDisplay:mssg});
      console.log('rec msg = ',that.state.messgeDisplay);
    });
  }
  senderHandleChange(e){
    this.setState({sender:e.target.value})
  }
  channelIDHandleChange(e){
    this.setState({channelID:e.target.value})
  }
  msgHandleChange(e){
    this.setState({msg:e.target.value})
  }
  handleClick(){
    console.log('message emitted __ logged from form.jsx->handleClick');
    socket.emit("send message", this.state.sender, this.state.channelID, this.state.msg, new Date());

    this.setState({sender:"", channelID:"", msg:""});
    console.log('reset state : ', this.state.sender, this.state.channelID, this.state.msg);
  }

handleChange(e){
  this.setState({channel:e.target.value});
}

  listenHandleClick(){

    socket.emit("subscribe",this.state.channel);

  }

  render() {
    return(
      <div>
        <div>
          Name:<input type="text" value={this.state.sender} onChange={this.senderHandleChange}/><br/>
          ChannelID:<input type="text" value={this.state.channelID} onChange={this.channelIDHandleChange}/><br/>
          Message:<input type="text" value={this.state.msg} onChange={this.msgHandleChange}/><br/>
          <input type="submit" onClick={this.handleClick}/>
        </div>
        <div>
          {this.state.messgeDisplay.map(function(item,i){
            return(<div key={i}>{item}</div>)
          })}<br/>
          <input type="text" value={this.state.channel} onChange={this.handleChange}/>
          <input type="submit" value="listen" onClick={this.listenHandleClick}/>
        </div>

      </div>
    );
  }
  // render() {
  //   return (
  //     <div>
  //     <MuiThemeProvider>
  //       Sender : <TextField hint="sender" value={this.state.sender} onChange={this.senderHandleChange}/>
  //       Receiver : <TextField hint="channelID" value={this.state.sender} onChange={this.senderHandleChange}/>
  //       Message : <TextField hint="Message" value={this.state.sender} onChange={this.senderHandleChange}/>
  //     </MuiThemeProvider>
  //     </div>
  //   )
  // }
}
