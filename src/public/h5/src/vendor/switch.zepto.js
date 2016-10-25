;(function($){

	function Switch(ele,setting){
		var defaultSetting = { //默认的设置
				"btncolor":"#fff",//按钮的背景色
				"oncolor":"#2db7f5",//在开关处于打开情况下时的容器背景颜色
				"offcolor":"#ccc",//在开关处于关闭情况下时的容器背景颜色
				"width":"40px"
		}
		
		//如果是字符串，就当作id处理
		//如果是dom元素，就直接使用
		this.$ele = null;

		this.getValue = function(){
			return this.value
		}

		this.setChecked = function(value) {
			this.value = value
			this.updateValue();
		}

		this.setting = $.extend(defaultSetting,setting); //保存用户的设置

		if(typeof ele === "string"){
			this.$ele = $("#"+ele);
		} else {
			this.$ele = $(ele);
		}

		var that = this;
		this.$ele.css("display","none");
		this.value = this.$ele.prop("checked"); //获取ele的初始的状态，保存值
		this.userChecked = this.value;
		this.$switchbox = $("<div class='switchbox'>");
		this.$switchbox.css("width",parseInt(this.setting.width) + "px");
		this.$switchbox.css("height",parseInt(this.setting.width)/2 + "px");
		this.$switchbox.css("borderRadius",parseInt(this.setting.width)/4 + "px");
		this.$switchcontent = $("<div class='switchcontent'>");
		this.$switchcontent.css("backgroundColor",this.setting.btncolor);
		this.$switchcontent.css("width",(parseInt(this.setting.width) - 8)/2 + "px");
		this.$switchcontent.css("height",(parseInt(this.setting.width) - 8)/2 + "px");
		this.$switchcontent.css("top","2px");
		this.$switchcontent.css("borderRadius",(parseInt(this.setting.width)-2)/4 + "px");
		this.$switchbox.append(this.$switchcontent); 
		this.$ele.parent().append(this.$switchbox);
		//根据ele的初始的选中情况，来设置插件的状态。
		this.updateValue();

		// this.$switchbox.on("tap",function(){
		// 	that.value = !that.value;
		// 	that.updateValue();
		// 	that.$ele.prop("checked",that.value);
		// })
	}

	//更新插件的显示状态
	Switch.prototype.updateValue = function(){
		if(this.value){
			this.$switchcontent.css("left",parseInt(this.setting.width)/2 +"px");
			this.$switchbox.css("backgroundColor",this.setting.oncolor);
		}else{
			this.$switchcontent.css("left","4px");
			this.$switchbox.css("backgroundColor",this.setting.offcolor);
		}
	}

	window.Switch = Switch;

	//<input data-role="switch" id="checkbox2" type="checkbox"  value="y" />

	$(function(){
		var inputs = $("input[data-role='switch']");
		for(var i=0;i<inputs.size();i++){
			var setting={}
			var oncolor = inputs[i].getAttribute("data-role-oncolor");
			if(oncolor){
				setting.oncolor = oncolor;
			}
			new Switch(inputs[i],setting);
		}
	});
})(Zepto)

