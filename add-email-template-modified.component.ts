import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MessageService } from '../message.service';
import { NotifierService } from 'angular-notifier';
import { RestApiService } from '../rest-api.service';
import { Router } from '@angular/router';
import { Formatters, OnEventArgs } from 'angular-slickgrid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomInputEditor } from '../custom-inputEditor';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add-email-template-modified',
  templateUrl: './add-email-template-modified.component.html',
  styleUrls: ['./add-email-template-modified.component.css']
})
export class AddEmailTemplateModifiedComponent implements OnInit, OnDestroy {
    displayed = true;
  subject: string;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  displayData: any;
  notification_type_id: number;
  isError = false;
  errorMessage: string;
  nextOffset: number;
  previousOffset: number;
  pageSize: number;
  paginationType: string;
  page_no: number;
  totalPage: number;
  clientId: number;
  private baseFlag: any;
  private userAuth: Subscription;
  private notifier: NotifierService;
  offset: number;
  tickets = [];
  ticket_status = [];
  ticketSelected: number;
  // supportGroupSelected: number;
  ticket_type: string;
  // support_group = [];
  editorValue: string;
  ticketStatus: string;
  supportGroup: string;
  ticketTypeSeqNo: number;
  private modalReference: NgbModalRef;
  categories = [];
  ststusSelected: number;
  category: string;
  categorySelected: number;
  selectedActionValue: number;
  ticketActivityList = [];
  selectedActivity: number;
  ActivityId: number;
  lebelHidden: boolean;
  dataLoaded: boolean;
  categorySelectedValues = [];
  loadApi: boolean;


  @ViewChild('content1') private content1;
  selectedId: any;
  sms_template: any;
  sms_template_id: any;

  constructor(private _rest: RestApiService, private messageService: MessageService,
    private route: Router, private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      switch (item.type) {
        case 'change':
          console.log('changed');
          if (!this.messageService.edit) {
            this.notifier.notify('error', 'You do not have edit permission');
          } else {
            if (confirm('Are you sure?')) {
            }
          }
          break;
        case 'delete':
          // console.log('deleted');
          if (!this.messageService.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              // console.log(JSON.stringify(item));
              this._rest.deleteMailTemplateLt({ user_id: this.messageService.getUserId(), id: item.id }).subscribe((res) => {
                this.respObject = res;
                // console.log(JSON.stringify(this.respObject));
                if (this.respObject.success) {
                  this.messageService.sendAfterDelete(item.id);
                  this.notifier.notify('success', 'Template Deleted successfully');
                } else {
                  this.notifier.notify('error', this.respObject.errorMessage);
                }
              }, (err) => {
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
              });
            }
          }
          break;
      }
    });
    this.messageService.getSelectedItemData().subscribe(selectedTitles => {
      if (selectedTitles.length > 0) {
        this.show = true;
        this.selected = selectedTitles.length;
      } else {
        this.show = false;
      }
    });
    this.messageService.getUserAuth().subscribe(details => {
      console.log(JSON.stringify(details));
      if (details.length > 0) {
        this.add = details[0].addFlag;
        this.del = details[0].deleteFlag;
        this.view = details[0].viewFlag;
        this.edit = details[0].editFlag;
      } else {
        this.add = false;
        this.del = false;
        this.view = false;
        this.edit = false;
      }
    });
  }

  ngOnInit() {
    this.dataLoaded = true;
    this.lebelHidden = true;
    this.nextOffset = 0;
    this.previousOffset = 0;
    this.pageSize = this.messageService.pageSize;
    this.page_no = 0;
    this.totalPage = 0;
    this.paginationType = 'next';
    this.editorValue = '';
    this.sms_template = '';
    this.sms_template_id ='';
    this.ticketStatus = '';
    this.supportGroup = '';
    this.displayData = {
      pageName: 'Maintain Email Template',
      openModalButton: 'Add Email Template',
      breadcrumb: 'Email Template',
      folderName: 'All Email Template',
      tabName: 'Email Template'
    };
    // const data = {
    //     clientId: this.clientId, ticket_type_id: this.ticketSelected, ticket_status_id: this.selectedStatus.join(', '),
    //     to_support_group: this.selectedSupportGroup.join(', '), subject: this.subject, template: this.editorValue ,
    //     createdBy: this.messageService.getUserId()
    // };
    const columnDefinitions = [
      {
        id: 'delete',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
      },
      {
        id: 'edit',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          console.log('args====' + JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          // this.selectedActionValue = Number(args.dataContext.notification_type);
          // this.ticketTypeSeqNo = args.dataContext.sequence_no;
          // this.ticketSelected = args.dataContext.ticket_type_id;
          // this.ststusSelected = args.dataContext.notification_type_id;
          // this.selectedActivity = args.dataContext.notification_type_id;
          // this.categorySelected = args.dataContext.category_id;
          // console.log('categorySelected111===' + this.categorySelected);
          this.subject = args.dataContext.subject;
          this.editorValue = args.dataContext.msg_body_content;
          this.sms_template = args.dataContext.sms_template;
          this.sms_template_id = args.dataContext.sms_template_id;
          this.modalReference = this.modalService.open(this.content1, { size: 'lg' });
          this.modalReference.result.then((result) => {
          }, (reason) => {
          });
        }
      },

      // {id: 'id', name: 'Id', field: 'id', sortable: true, filterable: true},
      { id: 'type', name: 'Ticket Type', field: 'ticketType', sortable: true, filterable: true },
      { id: 'category', name: 'Category', field: 'category', sortable: true, filterable: true },
      { id: 'action_type', name: 'Action Type', field: 'action_type', sortable: true, filterable: true },
      { id: 'sms_template_id', name: 'SMS Id', field: 'sms_template_id', sortable: true, filterable: true },
      { id: 'sms_template', name: 'SMS Template', field: 'sms_template', sortable: true, filterable: true },
      { id: 'action', name: 'Status/Activity', field: 'action', sortable: true, filterable: true }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        this.view = auth[0].viewFlag;
        this.add = auth[0].addFlag;
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientId;
        this.baseFlag = auth[0].baseFlag;
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    this._rest.getTicketType(this.clientId).subscribe((res1) => {
      this.respObject = res1;
      if (this.respObject.success) {
        this.isError = false;
        this.respObject.details.unshift({ id: 0, name: 'Select Ticket Type' });
        this.tickets = this.respObject.details;
        this.ticketSelected = 0;
      } else {
        this.notifier.notify('error', this.respObject.errorMessage);
      }
    }, (err) => {
      this.notifier.notify('error', JSON.stringify(err));
    });
    this.getTableData();
  }
  openModal(content) {
    if (!this.messageService.add) {
      this.notifier.notify('error', 'You do not have add permission');
    } else {
      this.isError = false;
      this.subject = '';
      this.sms_template = '';
      this.sms_template_id = '';
      this.ticket_status = [];
      this.editorValue = '';
      this.selectedActionValue = 0;
      this.ticketActivityList = [];
      this.selectedActivity = 0;

      this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      }, (reason) => {

      });
    }

  }

  onChnageActionType() {
    // console.log("Action Changed");
    this.ticketSelected = 0;
    this.ticket_status = [];
    this.ticketActivityList = [];
    this.categories = [];
    this.lebelHidden = true;
  }

  onActivityChange(value: any) {
    this.ActivityId = this.ticketActivityList[value].id;
    // console.log(this.ActivityId);
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  // get selectedSupportGroup() {
  //   return this.support_group
  //     .filter(opt => opt.checked)
  //     .map(opt => opt.id);
  // }
  //
  // get selectedSupportGroupName() {
  //   return this.support_group
  //     .filter(opt => opt.checked)
  //     .map(opt => opt.name);
  // }

  get selectedCategory() {
    return this.categories
      .filter(opt => opt.checked)
      .map(opt => opt.id);
  }

  save() {
    const statusSelectedArray = [];
    for (let i = 0; i < this.selectedFieldValue.length; i++) {
      statusSelectedArray.push(this.selectedFieldValue[i]);
    }
    if (this.selectedActionValue === 1) {
      this.notification_type_id = this.ststusSelected;
    } else if (this.selectedActionValue === 2) {
      this.notification_type_id = this.ActivityId;
    }
    this.categorySelectedValues = [];
    if (this.categorySelected === 0) {
      this.isError = true;
      this.errorMessage = 'Please Select Category';
      return;
    } else if (this.categorySelected === -1 || this.categorySelected.toString() === '-1') {
      for (let i = 2; i < this.categories.length; i++) {
        this.categorySelectedValues.push(this.categories[i].id);
      }
    } else {
      this.categorySelectedValues.push(this.categorySelected);
    }

    const data = {
      clientId: this.clientId,
      ticket_type_id: this.ticketSelected,
      category_id: this.categorySelectedValues,
      subject: this.subject,
      sms_template: this.sms_template,
      sms_template_id: this.sms_template_id,
      template: this.editorValue,
      createdBy: this.messageService.getUserId(),
      notification_type: this.selectedActionValue,
      notification_type_id: this.notification_type_id
    };
    if (!this.messageService.isBlankField(data)) {
      this._rest.insertMailTemplateLt(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          this.nextOffset = 0;
          this.page_no = 0;
          this.getTableData();
          this.ticketSelected = 0;
          this.ststusSelected = 0;
          this.categorySelected = 0;
          this.editorValue = '';
          this.sms_template = '';
          this.sms_template_id = '';
        } else {
          this.isError = true;
          this.errorMessage = this.respObject.errorMessage;
        }
      }, (err) => {
        this.isError = true;
        this.errorMessage = this.messageService.SERVER_ERROR;
      });
    } else {
      this.isError = true;
      this.errorMessage = this.messageService.BLANK_ERROR_MESSAGE;
    }
  }


  update() {
    const data = {
      selectedId: this.selectedId,
      subject: this.subject,
      template: this.editorValue,
      sms_template: this.sms_template,
      sms_template_id: this.sms_template_id,
      
      createdBy: this.messageService.getUserId(),
    };
    if (!this.messageService.isBlankField(data)) {
      this._rest.updateMailTemplateLt(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.modalReference.close();
          this.getTableData();
          this.notifier.notify('success', 'update successfully');
        } else {
          this.isError = true;
          this.errorMessage = this.respObject.errorMessage;
        }
      }, (err) => {
        this.isError = true;
        this.errorMessage = this.messageService.SERVER_ERROR;
      });
    } else {
      this.isError = true;
      this.errorMessage = this.messageService.BLANK_ERROR_MESSAGE;
    }
  }



  getTableData() {
    if (!this.messageService.view) {
      this.notifier.notify('error', 'You do not have view permission');
    } else {
      this.getData({ 'offset': this.nextOffset, 'paginationType': '' });
    }

  }

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const paginationType = paginationObj.paginationType;
    this._rest.getMailTemplateLt(offset, this.pageSize, paginationType, this.clientId).subscribe((res) => {
      this.respObject = res;
      this.executeResponse(this.respObject, offset, paginationType);
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  executeResponse(respObject, offset, paginationType) {
    if (respObject.success) {
      if (offset === 0) {
        this.totalData = respObject.details.totalData[0].count;
        this.totalPage = respObject.details.totalPage;
        if (this.totalPage === 0) {
          this.totalPage = 1;
        }
      }
      if (!this.isEmpty(respObject.details.dataObj)) {
        const data = respObject.details.dataObj;
        this.nextOffset = respObject.details.nextOffset;
        this.offset = respObject.details.nextOffset;
        this.previousOffset = respObject.details.previousOffset;
        this.messageService.setTotalData(this.totalData);
        this.messageService.setGridData(data);
        // ----------------------------------------------
        if (offset !== 0) {
          const totalCount = this.totalData;
          const divRes = totalCount / this.pageSize;
          const remainder = totalCount % this.pageSize;
          if (remainder === 0) {
            this.totalPage = parseInt(String(divRes), 10);
          } else {
            this.totalPage = parseInt(String(divRes), 10) + 1;
          }
        }
        // ------------------------------------------------
        if (paginationType === 'next') {
          this.page_no = this.page_no + 1;
        } else if (paginationType === 'prev') {
          this.page_no = this.page_no - 1;
        } else if (paginationType === '' && this.page_no === 0) {
          this.page_no = this.page_no + 1;
        }
        if (this.totalData <= this.pageSize * this.page_no) {
          this.nextOffset = 0;
        }
      } else if (this.isEmpty(respObject.details.dataObj) && paginationType === 'next') {
        this.nextOffset = 0;
      } else if (this.isEmpty(respObject.details.dataObj) && paginationType === 'prev') {
        this.previousOffset = 0;
      } else if (paginationType === '' && this.page_no === 0) {
        this.page_no = this.page_no + 1;
      }
    } else {
      this.notifier.notify('error', respObject.errorMessage);
    }
  }

  get selectedFieldValue() {
    return this.ticket_status
      .filter(opt => opt.checked)
      .map(opt => opt.id);

  }
  onPageSizeChange(value: any) {
    this.page_no = 0;
    this.nextOffset = 0;
    this.pageSize = value;
    this.getData({ 'offset': this.nextOffset, 'paginationType': '' });
  }

  onTicketChange(selectedIndex: any) {
    this.ticket_type = this.tickets[selectedIndex].name;
    this.ticketTypeSeqNo = this.tickets[selectedIndex].seq;
    if (this.selectedActionValue === 1) {
      this._rest.getStatusByTicketTypeLt(this.ticketTypeSeqNo, this.clientId).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.respObject.details.unshift({ id: 0, status: 'Select Ticket Status' });
          this.ticket_status = this.respObject.details;
          this.ststusSelected = 0;
        } else {
          this.notifier.notify('error', this.respObject.errorMessage);
        }
      }, (err) => {
        this.notifier.notify('error', JSON.stringify(err));
      });

    } else if (this.selectedActionValue === 2) {
      // Get Activity
      this._rest.getTicketActivityMst().subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.respObject.details.unshift({ id: 0, activity_desc: 'Select Ticket Activity' });
          this.ticketActivityList = this.respObject.details;
          this.selectedActivity = 0;
          // console.log("Action List");
        } else {
          this.notifier.notify('error', this.respObject.errorMessage);
        }
      }, (err) => {
        this.notifier.notify('error', JSON.stringify(err));
      });

    }
    this._rest.getCategoryByTicketTypeNDynamicLevel(this.clientId, this.ticketSelected).subscribe((res1) => {
      this.respObject = res1;
      if (this.respObject.success) {
        this.respObject.details.unshift({ id: 0, name: 'Select Category' }, { id: -1, name: 'Select All' });
        this.isError = false;
        this.categories = this.respObject.details;
        this.categorySelected = 0;
      } else {
        this.isError = true;
        this.errorMessage = this.respObject.errorMessage;
      }
    }, (err) => {
      this.isError = true;
      this.errorMessage = this.messageService.SERVER_ERROR;
    });
  }
  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }
}
