sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/Dialog",
	"sap/ui/unified/FileUploader",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Filter"
], function(Controller, JSONModel, History, Dialog, FileUploader, MessageToast, MessageBox, Filter) {
	"use strict";

	return Controller.extend("mat.coll.avg.controller.Main", {
		onInit: function(){
				this.oLocalModel = new JSONModel({
					"matdata" : { "Material" : "", "Location" : ""},
					"AllInq": [],
					"data": []
				});
				this.getView().setModel(this.oLocalModel, "local");
				this.oDataModel = this.getOwnerComponent().getModel();
				this.oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
	            this.oVizFrame.setVizProperties({
	                title: {
	                    visible: false
	                },
	                 plotArea: {
                        dataLabel: {
                            visible: true
                        }
                    }
	            });
		},
		inpField: "",
		onSelectValue: function(oEvent){
				var selectedItem = oEvent.getParameter("selectedItem");
				var sTitle = selectedItem.getLabel();
				sap.ui.getCore().byId(this.inpField).setValue(sTitle);
				var that = this;
				if(this.inpField.indexOf("Material") !== -1){
					this.getView().byId("Location").setValue("");
					this.oDataModel.read("/MatCollectorSet",{
						filters: [new Filter("Material", "EQ", sTitle)],
						success: function(data){
							that.oLocalModel.setProperty("/data",data.results);
						}
					});
				}else{
					this.getView().byId("Material").setValue("");
					this.oDataModel.read("/MatCollectorSet",{
						filters: [new Filter("Location", "EQ", sTitle)],
						success: function(data){
							that.oLocalModel.setProperty("/data",data.results);
							that.oVizFrame.setModel(that.oLocalModel);
							that.oVizFrame.getDataset().bindData("local>/data");
							debugger;
						}
					});
				}
				
				
		},
		cityPopup: null,
		onValueHelp: function(oEvent){
			this.inpField = oEvent.getSource().getId();
			//lo_alv->set_table_for_first_display
			//MessageBox.confirm("this functionality is under construction");
			if(this.inpField.indexOf("Material") !== -1){
				this.cityPopup = sap.ui.xmlfragment("mat.coll.avg.fragments.popup", this);	
				this.cityPopup.bindAggregation("items",{
					path: "/ValueHelpSet",
					filters: [new Filter("Key", "EQ","M-")],
					template: new sap.m.DisplayListItem({
						label: "{Key}",
						value: "{Text}"
					})
				});
				this.cityPopup.setTitle("Materials");
				this.cityPopup.setMultiSelect(false);
				this.getView().addDependent(this.cityPopup);
				this.cityPopup.open();
			}else{
				this.cityPopup = sap.ui.xmlfragment("mat.coll.avg.fragments.popup", this);	
				this.cityPopup.bindAggregation("items",{
					path: "/ValueHelpSet",
					filters: [new Filter("Key", "EQ","L-")],
					template: new sap.m.DisplayListItem({
						label: "{Key}",
						value: "{Text}"
					})
				});
				this.cityPopup.setTitle("Locations");
				this.cityPopup.setMultiSelect(false);
				this.getView().addDependent(this.cityPopup);
				this.cityPopup.open();
			}
			
		}
	});
});