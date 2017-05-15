// The MIT License (MIT)

// Copyright (c) 2017 kekeh

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { h, Component } from 'preact';


// import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewEncapsulation, ChangeDetectorRef, Renderer, ViewChild, forwardRef } from "@angular/core";
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import {
    IMyDate, IMyDateRange, IMyMonth, IMyCalendarDay, IMyCalendarMonth, IMyCalendarYear, IMyWeek, IMyDayLabels,
    IMyMonthLabels, IMyOptions, IMyDateModel, IMyInputFieldChanged, IMyCalendarViewChanged, IMyInputFocusBlur,
    IMyMarkedDates, IMyMarkedDate
} from './interfaces';
import { LocaleService } from "./services/my-date-picker.locale.service";
import { UtilService } from "./services/my-date-picker.util.service";

let styles = require('../src/css/style.css');
let classNames = require('classnames');



// MG
// // webpack1_
// declare var require: any;
// const myDpStyles: string = require("./my-date-picker.component.css");
// const myDpTpl: string = require("./my-date-picker.component.html");
// // webpack2_



enum CalToggle { Open = 1, CloseByDateSel = 2, CloseByCalBtn = 3, CloseByOutClick = 4, CloseByEsc = 5 }
enum Year { min = 1100, max = 9100 }
enum InputFocusBlur { focus = 1, blur = 2 }
enum KeyCode { enter = 13, esc = 27, space = 32 }
enum MonthId { prev = 1, curr = 2, next = 3 }

const MM = "mm";
const MMM = "mmm";
const DD = "dd";
const YYYY = "yyyy";


/**
 * Angular input properties map differently to React / Preact props and state concepts.  For preact
 * the props are not editable (not counting workarounds / kludges
 *  http://stackoverflow.com/questions/24939623/can-i-update-a-components-props-in-react-js) by the component
 * itself.  The preact state is the editable part from within the component itself.
 * 
 * Angular input properties simulataneously model both props and state functions from Preact
 * 
 * An extra indirection (setter) will be needed for each of these ported (from Angular) input properties
 * The setter will serve the automatic (monkey patched) change state wiring for ngOnChanges logic porting
 * 
 * 
 */
export interface MyDateProps {
    // MG
    options: IMyOptions;
    locale: string;
    defaultMonth: string;
    selDate: string;
    placeholder: string;
    selector: number;
    disabled: boolean;
    localeService: LocaleService;
    utilService: UtilService;

}







export class MyDatePicker extends Component<MyDateProps, any> {

    // MG 

    private options: IMyOptions;




    private locale: string;
    private defaultMonth: string;
    private selDate: string;
    private placeholder: string;
    private selector: number;
    private disabled: boolean;

    private localeService: LocaleService;
    private utilService: UtilService;







    // @Output() dateChanged: EventEmitter<IMyDateModel> = new EventEmitter<IMyDateModel>();
    // @Output() inputFieldChanged: EventEmitter<IMyInputFieldChanged> = new EventEmitter<IMyInputFieldChanged>();
    // @Output() calendarViewChanged: EventEmitter<IMyCalendarViewChanged> = new EventEmitter<IMyCalendarViewChanged>();
    // @Output() calendarToggle: EventEmitter<number> = new EventEmitter<number>();
    // @Output() inputFocusBlur: EventEmitter<IMyInputFocusBlur> = new EventEmitter<IMyInputFocusBlur>();
    // @ViewChild("selectorEl") selectorEl: any;

    onChangeCb: (_: any) => void = () => { };
    onTouchedCb: () => void = () => { };

    showSelector: boolean = false;
    visibleMonth: IMyMonth = { monthTxt: "", monthNbr: 0, year: 0 };
    selectedMonth: IMyMonth = { monthTxt: "", monthNbr: 0, year: 0 };
    selectedDate: IMyDate = { year: 0, month: 0, day: 0 };
    weekDays: Array<string> = [];
    dates: Array<IMyWeek> = [];
    months: Array<Array<IMyCalendarMonth>> = [];
    years: Array<Array<IMyCalendarYear>> = [];
    selectionDayTxt: string = '';
    invalidDate: boolean = false;
    disableTodayBtn: boolean = false;
    dayIdx: number = 0;
    weekDayOpts: Array<string> = ["su", "mo", "tu", "we", "th", "fr", "sa"];

    selectMonth: boolean = false;
    selectYear: boolean = false;

    prevMonthDisabled: boolean = false;
    nextMonthDisabled: boolean = false;
    prevYearDisabled: boolean = false;
    nextYearDisabled: boolean = false;
    prevYearsDisabled: boolean = false;
    nextYearsDisabled: boolean = false;

    prevMonthId: number = MonthId.prev;
    currMonthId: number = MonthId.curr;
    nextMonthId: number = MonthId.next;






    // Default options
    opts: IMyOptions = {
        dayLabels: {} as IMyDayLabels,
        monthLabels: {} as IMyMonthLabels,
        dateFormat: 'mm.dd.yyyy' as string,
        showTodayBtn: true as boolean,
        todayBtnTxt: 'Today' as string,
        firstDayOfWeek: 'mon' as string,
        satHighlight: false as boolean,
        sunHighlight: true as boolean,
        highlightDates: [] as Array<IMyDate>,
        markCurrentDay: true as boolean,
        disableUntil: { year: 0, month: 0, day: 0 } as IMyDate,
        disableSince: { year: 0, month: 0, day: 0 } as IMyDate,
        disableDays: [] as Array<IMyDate>,
        enableDays: [] as Array<IMyDate>,
        markDates: [] as Array<IMyMarkedDates>,
        markWeekends: {} as IMyMarkedDate,
        disableDateRanges: [] as Array<IMyDateRange>,
        disableWeekends: false as boolean,
        showWeekNumbers: true as boolean,
        height: '34px' as string,
        width: "100%" as string,
        selectionTxtFontSize: "14px" as string,
        inline: false as boolean,
        showClearDateBtn: true as boolean,
        showDecreaseDateBtn: false,
        showIncreaseDateBtn: false,
        alignSelectorRight: false,
        openSelectorTopOfInput: false,
        indicateInvalidDate: true,
        editableDateField: true,
        monthSelector: true,
        yearSelector: true,
        disableHeaderButtons: true,
        minYear: Year.min as number,
        maxYear: Year.max as number,
        componentDisabled: false,
        showSelectorArrow: true,
        showInputField: true,
        openSelectorOnInputClick: false,
        ariaLabelInputField: "Date input field",
        ariaLabelClearDate: "Clear Date",
        ariaLabelDecreaseDate: "Decrease Date",
        ariaLabelIncreaseDate: "Increase Date",
        ariaLabelOpenCalendar: "Open Calendar",
        ariaLabelPrevMonth: "Previous Month",
        ariaLabelNextMonth: "Next Month",
        ariaLabelPrevYear: "Previous Year",
        ariaLabelNextYear: "Next Year"
    };


    constructor(props) {
        super(props)

        this.options = this.props.options;

        this.locale = this.props.locale;
        this.defaultMonth = this.props.defaultMonth;
        this.selDate = this.props.selDate;
        this.placeholder = this.props.placeholder;
        this.selector = this.props.selector;
        this.disabled = this.props.disabled;



        // if options received in props - merge into default options
        this.localeService = this.props.localeService;
        this.utilService = this.props.utilService;

        this.ngOnChanges();

    }


    /**
     * For all the inidividual props being passed (input properties in Angular version) the setter will
     * trigger a view update; on this preact codebase that translates to a set state but running the common
     * ngChnages logic (from Angular code base) before the set state
     */


    public set $locale(value: string) {
        this.locale = value;
        this.ngOnChanges();
        this.setState({});
    }

    public set $defaultMonth(value: string) {
        this.defaultMonth = value;
        this.ngOnChanges();

        let dm: string = value;
        if (dm !== null && dm !== undefined && dm !== "") {
            this.selectedMonth = this.parseSelectedMonth(dm);
        }
        else {
            this.selectedMonth = { monthTxt: "", monthNbr: 0, year: 0 };
        }
        this.setState({});
    }

    public set $selDate(value: string) {
        this.selDate = value;
        this.ngOnChanges();

        let sd: any = value;
        if (sd.currentValue !== null && sd.currentValue !== undefined && sd.currentValue !== "" && Object.keys(sd.currentValue).length !== 0) {
            this.selectedDate = this.parseSelectedDate(sd.currentValue);
            setTimeout(() => {
                this.onChangeCb(this.getDateModel(this.selectedDate));
            });
        }
        else {
            // Do not clear on init
            if (!sd.isFirstChange()) {
                this.clearDate();
            }
        }

        this.setState({});
    }

    public set $placeholder(value: string) {
        this.placeholder = value;
        this.ngOnChanges();
        this.setState({});
    }

    public set $selector(value: number) {
        if (value > 0) {
            this.selector = value;
            this.openBtnClicked();
        }

        this.setState({});
    }

    public set $disabled(value: boolean) {
        this.disabled = value;
        this.ngOnChanges();
        this.setState({});
    }


    public set $options(value: IMyOptions) {
        this.options = value;

        this.ngOnChanges();
        this.setState({});
    }


    ngOnChanges() {

        this.weekDays.length = 0;
        this.parseOptions();

        if (this.opts.inline) {
            this.setVisibleMonth();
        }
        else if (this.showSelector) {
            this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year, false);
        }
    }



    render(props) {
        return <div>
            {this.renderWrapperDiv()}
        </div>
    }




    /**
     * 
     */
    renderWrapperDiv() {

        let style = {};
        if (this.opts.showInputField) {
            style['width'] = this.opts.width
        }

        if (this.opts.inline) {
            style['border'] = 'none'
        }


        return <div class={styles.mydp} style={style} >

            {this.renderSelectionGroup()}

            {this.renderSelector()}
        </div>;

    }


    renderSelectionGroup() {
        if (!this.opts.inline) {
            return <div class={styles.selectiongroup} >
                {this.renderSelectionInputField()}
                {this.renderSelBtnGroup()}
            </div>
        } else {
            return;
        }
    }



    /**
     * The input field
     */
    renderSelectionInputField() {


        //  
        //              [ngModel]="selectionDayTxt" (ngModelChange)="onUserDateInput($event)" [value]="selectionDayTxt" (keyup)="onCloseSelector($event)"
        //            (focus)="opts.editableDateField&&onFocusInput($event)" 
        //            (blur)="opts.editableDateField&&onBlurInput($event)"



        let style = {};

        style['height'] = this.opts.height
        style['font-size'] = this.opts.selectionTxtFontSize;


        let classStr = classNames({ invaliddate: this.invalidDate && this.opts.indicateInvalidDate },
            { inputnoteditable: this.opts.openSelectorOnInputClick && !this.opts.editableDateField },
            { selectiondisabled: this.opts.componentDisabled });



        let showInputField = this.opts.showInputField;

        let onclickFunction: Function = () => {
            if (this.opts.openSelectorOnInputClick && !this.opts.editableDateField) {
                return this.openBtnClicked.bind(this);
            } else {
                // do nothing function
                return () => { }
            }

        }

        if (showInputField) {

            return <input type="text" class={styles.selection + ' ' + this.processStyles(classStr)}
                aria-label={this.opts.ariaLabelInputField}
                style={style}

                value={this.selectionDayTxt}

                onClick={onclickFunction()}

                placeholder={this.placeholder}

                disabled={this.opts.componentDisabled}

            />
        } else {
            return;
        }

    }






    renderSelBtnGroup() {

        let style = {};

        style['height'] = this.opts.height;




        let decreaseBtn = () => {


            let classStr = classNames(styles.mydpicon, styles.iconMydpleft);


            let btnDecEnabledStr: string = styles.btndecreaseenabled;
            let btnDecDisabledStr: string = styles.btndecreasedisabled;
            let radiusStr: string = styles.btnleftborderradius;

            let ngClassStr = classNames({ btnDecEnabledStr: !this.opts.componentDisabled },
                { btnDecDisabledStr: this.opts.componentDisabled },
                { radiusStr: !this.opts.showInputField });

            let showDecreaseBtn = this.opts.showDecreaseDateBtn;

            if (showDecreaseBtn) {
                return <button type="button" aria-label={this.opts.ariaLabelDecreaseDate}

                    class={styles.btndecrease + ' ' + this.processStyles(ngClassStr)}

                    onClick={this.onDecreaseBtnClicked.bind(this)}
                    disabled={this.opts.componentDisabled}>
                    <span class={classStr}></span>
                </button>
            } else {
                return;
            }
        }


        let increaseBtn = () => {


            let showIncreaseBtn = this.opts.showIncreaseDateBtn;

            let classStr = classNames(styles.mydpicon, styles.iconMydpright);


            let btnIncEnabledStr: string = styles.btnincreaseenabled;
            let btnIncDisabledStr: string = styles.btnincreasedisabled;
            let radiusStr: string = styles.btnleftborderradius;

            let ngClassStr = classNames({ btnIncEnabledStr: !this.opts.componentDisabled },
                { btnIncDisabledStr: this.opts.componentDisabled },
                { radiusStr: !this.opts.showDecreaseDateBtn && !this.opts.showInputField });


            if (showIncreaseBtn) {
                return <button type="button" aria-label={this.opts.ariaLabelIncreaseDate}

                    class={styles.btnincrease + ' ' + this.processStyles(ngClassStr)}

                    onClick={this.onIncreaseBtnClicked.bind(this)}
                    disabled={this.opts.componentDisabled}>
                    <span class={classStr}></span>
                </button>
            } else {
                return;
            }
        }



        let clearDate = () => {


            /*<button type="button" [attr.aria-label]="opts.ariaLabelClearDate" 
            class="btnclear" *ngIf="selectionDayTxt.length>0&&opts.showClearDateBtn" 
            (click)="removeBtnClicked()" 
            [ngClass]="{'btnclearenabled': !opts.componentDisabled,
             'btncleardisabled': opts.componentDisabled, 
             'btnleftborderradius': !opts.showIncreaseDateBtn&&!opts.showDecreaseDateBtn&&!opts.showInputField}"
             [disabled]="opts.componentDisabled">
                <span class="mydpicon icon-mydpremove"></span>
            </button>*/

            let classStr = classNames(styles.mydpicon, styles.iconMydpremove);


            let btnclearenabled: string = styles.btnclearenabled;
            let btncleardisabled: string = styles.btncleardisabled;
            let btnleftborderradius: string = styles.btnleftborderradius;

            let ngClassStr = classNames({ btnclearenabled: !this.opts.componentDisabled },
                { btncleardisabled: this.opts.componentDisabled },
                { btnleftborderradius: !this.opts.showIncreaseDateBtn && !this.opts.showDecreaseDateBtn && !this.opts.showInputField });


            if (this.selectionDayTxt.length > 0 && this.opts.showClearDateBtn) {

                return <button type="button" aria-label={this.opts.ariaLabelClearDate}
                    class={styles.btnclear + ' ' + this.processStyles(ngClassStr)}
                    onClick={this.removeBtnClicked.bind(this)}
                    disabled={this.opts.componentDisabled}>
                    <span class={classStr}></span>
                </button>

            } else {
                return;
            }
        }




        let openCalendar = () => {


            /*<button type="button" [attr.aria-label]="opts.ariaLabelOpenCalendar" 
            class="btnpicker" (click)="openBtnClicked()"
             [ngClass]="{'btnpickerenabled': !opts.componentDisabled,
              'btnpickerdisabled': opts.componentDisabled, 
              'btnleftborderradius': !opts.showClearDateBtn&&!opts.showIncreaseDateBtn&&
              !opts.showDecreaseDateBtn&&!opts.showInputField||selectionDayTxt.length===0&&!opts.showInputField}"
               [disabled]="opts.componentDisabled">
                <span class="mydpicon icon-mydpcalendar"></span>
            </button>*/


            let classStr = classNames(styles.mydpicon, styles.iconMydpcalendar);


            let btnpickerenabled: string = styles.btnpickerenabled;
            let btnpickerdisabled: string = styles.btnpickerdisabled;
            let btnleftborderradius: string = styles.btnleftborderradius;

            let ngClassStr = classNames({ btnpickerenabled: !this.opts.componentDisabled },
                { btnpickerdisabled: this.opts.componentDisabled },
                {
                    btnleftborderradius: !this.opts.showClearDateBtn &&
                    !this.opts.showIncreaseDateBtn &&
                    !this.opts.showDecreaseDateBtn &&
                    !this.opts.showInputField || this.selectionDayTxt.length === 0 &&
                    !this.opts.showInputField
                });


                return <button type="button" aria-label={this.opts.ariaLabelOpenCalendar}
                    class={styles.btnpicker + ' ' + this.processStyles(ngClassStr)} onClick={this.openBtnClicked.bind(this)}

                    disabled={this.opts.componentDisabled}>
                    <span class={classStr}></span>
                </button>

           
        }


        return <div class={styles.selbtngroup} style={style}>

            {decreaseBtn()}
            {increaseBtn()}
            {clearDate()}
            {openCalendar()}
        </div >



    }

    renderSelector() {

        // MG focus
        // [mydpfocus]="opts.inline?'0':'1'" 

        /*<div class="selector" #selectorEl 
        *ngIf="showSelector||opts.inline" [mydpfocus]="opts.inline?'0':'1'" 
        [ngStyle]="{'bottom': getSelectorTopPosition()}"
         [ngClass]="{'inlinedp': opts.inline, 
         'alignselectorright': opts.alignSelectorRight, 
         'selectorarrow': opts.showSelectorArrow&&!opts.inline,
          'selectorarrowleft': opts.showSelectorArrow&&!opts.alignSelectorRight&&!opts.inline,
           'selectorarrowright': opts.showSelectorArrow&&opts.alignSelectorRight&&!opts.inline}"
            (keyup)="onCloseSelector($event)" tabindex="0">*/


        let style = {};

        style['bottom'] = this.getSelectorTopPosition();

        let inlinedp: string = styles.inlinedp;
        let alignselectorright: string = styles.alignselectorright;
        let selectorarrow: string = styles.selectorarrow;
        let selectorarrowleft: string = styles.selectorarrowleft;
        let selectorarrowright: string = styles.selectorarrowright;


        let ngClassStr = classNames({ inlinedp: this.opts.inline },
            { alignselectorright: this.opts.alignSelectorRight },
            { selectorarrow: this.opts.showSelectorArrow && !this.opts.inline },
            { selectorarrowleft: this.opts.showSelectorArrow && !this.opts.alignSelectorRight && !this.opts.inline },
            { selectorarrowright: this.opts.showSelectorArrow && this.opts.alignSelectorRight && !this.opts.inline }
        );





        if (this.showSelector || this.opts.inline) {
            return <div class={styles.selector + ' ' + this.processStyles(ngClassStr)}
                style={style}
                onKeyUp={this.onCloseSelector.bind(this)}
                tabIndex={0}>
                {this.renderHeader()}
                {this.renderCalendarGrid()}
                {this.renderMonthTable()}
                {this.renderYearTable()}
            </div>
        } else {
            return;
        }
    }


    renderHeader() {

        return <table class={styles.header}>
            <tr>
                <td>{this.renderHeaderLeft()}</td>
                <td>{this.renderHeaderCenter()}</td>
                <td>{this.renderHeaderRight()}</td>

            </tr>
        </table>;

    }


    renderHeaderLeft() {

        return <div style="float:left">
            {this.renderPrevMonthBtn()}
            {this.renderMonthSelectorBtn()}
            {this.renderNextMonthBtn()}
        </div>

    }


    renderPrevMonthBtn() {
        let classStr = classNames(styles.headerbtn, styles.mydpicon, styles.iconMydpleft);


        let hBtnEnabledStr: string = styles.headerbtnenabled;
        let hBtnDisabledStr: string = styles.headerbtndisabled;

        let ngClassStr = classNames({ hBtnEnabledStr: !this.prevMonthDisabled },
            { hBtnDisabledStr: this.prevMonthDisabled });

        return <div class={styles.headerbtncell}>
            <button type="button" aria-label={this.opts.ariaLabelPrevMonth}
                class={classStr + ' ' + this.processStyles(ngClassStr)}
                onClick={this.onPrevMonth.bind(this)}
                disabled={this.prevMonthDisabled}>
            </button>
        </div>

    }

    renderMonthSelectorBtn() {

        let mLabelStr: string = styles.monthlabel;
        let ngClassStr = classNames({ mLabelStr: this.opts.monthSelector });


        let onclickFunction: Function = () => {
            if (this.opts.monthSelector) {
                return this.onSelectMonthClicked.bind(this);
            } else {
                // do nothing function
                return () => { }
            }

        }


        let tabIndexVal = this.opts.monthSelector ? 0 : -1;

        return <div class={styles.headermonthtxt}>
            <button type="button" class={styles.headerlabelbtn + ' ' + this.processStyles(ngClassStr)}
                onClick={onclickFunction()}
                tabIndex={tabIndexVal}>

                {this.visibleMonth.monthTxt}
            </button>
        </div>
    }




    renderNextMonthBtn() {

        let classStr = classNames(styles.headerbtn, styles.mydpicon, styles.iconMydpright);

        let hBtnEnabledStr: string = styles.headerbtnenabled;
        let hBtnDisabled: string = styles.headerbtndisabled;
        let ngClassStr = classNames({ hBtnEnabledStr: !this.nextMonthDisabled },
            { hBtnDisabled: this.nextMonthDisabled });

        return <div class={styles.headerbtncell}>
            <button type="button" aria-label={this.opts.ariaLabelNextMonth}
                class={classStr + ' ' + this.processStyles(ngClassStr)}
                onClick={this.onNextMonth.bind(this)}
                disabled={this.nextMonthDisabled}>

            </button>
        </div>

    }


    renderHeaderCenter() {


        let classStr = classNames(styles.mydpicon, styles.iconMydptoday);



        let hBtnEnabledStr: string = styles.headertodaybtnenabled;
        let hBtnDisabled: string = styles.headertodaybtndisabled;
        let ngClassStr = classNames({ hBtnEnabledStr: !this.disableTodayBtn },
            { hBtnDisabled: this.disableTodayBtn });



        if (this.opts.showTodayBtn) {
            return <button type="button" class={styles.headertodaybtn + ' ' + this.processStyles(ngClassStr)}
                onClick={this.onTodayClicked.bind(this)} disabled={this.disableTodayBtn}>
                <span class={classStr}></span>
                <span>{this.opts.todayBtnTxt}</span>
            </button>
        } else {
            return;
        }
    }




    renderHeaderRight() {

        return <div style="float:right">
            {this.renderPrevYearBtn()}
            {this.renderYearSelectorBtn()}
            {this.renderNextYearBtn()}
        </div>

    }


    renderPrevYearBtn() {




        let classStr = classNames(styles.headerbtn, styles.mydpicon, styles.iconMydpleft);


        let hBtnEnabledStr: string = styles.headerbtnenabled;
        let hBtnDisabledStr: string = styles.headerbtndisabled;

        let ngClassStr = classNames({ hBtnEnabledStr: !this.prevYearDisabled },
            { hBtnDisabledStr: this.prevYearDisabled });

        return <div class={styles.headerbtncell}>
            <button type="button" aria-label={this.opts.ariaLabelPrevYear}
                class={classStr + ' ' + this.processStyles(ngClassStr)}
                onClick={this.onPrevYear.bind(this)}
                disabled={this.prevYearDisabled}>
            </button>
        </div>

    }



    renderYearSelectorBtn() {

        let mLabelStr: string = styles.yearlabel;
        let ngClassStr = classNames({ mLabelStr: this.opts.yearSelector });


        let onclickFunction: Function = () => {
            if (this.opts.yearSelector) {
                return this.onSelectYearClicked.bind(this);
            } else {
                // do nothing function
                return () => { }
            }

        }


        let tabIndexVal = this.opts.yearSelector ? 0 : -1;

        return <div class={styles.headeryeartxt}>
            <button type="button" class={styles.headerlabelbtn + ' ' + this.processStyles(ngClassStr)}
                onClick={onclickFunction()}
                tabIndex={tabIndexVal}>
                {this.visibleMonth.year}
            </button>
        </div>
    }


    renderNextYearBtn() {

        /*<div class="headerbtncell">
            <button type="button" [attr.aria-label]="opts.ariaLabelNextYear" 
                    class="headerbtn mydpicon icon-mydpright" (click)="onNextYear()" 
                    [disabled]="nextYearDisabled" [ngClass]="{'headerbtnenabled': !nextYearDisabled, 'headerbtndisabled': nextYearDisabled}">
            </button>
        </div>*/


        let classStr = classNames(styles.headerbtn, styles.mydpicon, styles.iconMydpright);


        let headerbtnenabled: string = styles.headerbtnenabled;
        let headerbtndisabled: string = styles.headerbtndisabled;

        let ngClassStr = classNames({ headerbtnenabled: !this.nextYearDisabled },
            { headerbtndisabled: this.nextYearDisabled });

        return <div class={styles.headerbtncell}>
            <button type="button" aria-label={this.opts.ariaLabelNextYear}
                class={classStr + ' ' + this.processStyles(ngClassStr)}
                onClick={this.onNextYear.bind(this)}
                disabled={this.nextYearDisabled}>
            </button>
        </div>

    }



    renderCalendarGrid() {
        /*<table class="caltable" *ngIf="!selectMonth&&!selectYear">
           <thead><tr><th class="weekdaytitle weekdaytitleweeknbr"
            *ngIf="opts.showWeekNumbers&&opts.firstDayOfWeek==='mo'">#</th>
            <th class="weekdaytitle" scope="col" *ngFor="let d of weekDays">{{d}}</th></tr></thead>*/


        const firstTH = () => {

            let classStr = classNames(styles.weekdaytitle, styles.weekdaytitleweeknbr);

            if (this.opts.showWeekNumbers && this.opts.firstDayOfWeek === 'mo') {
                return <th class={classStr}>#</th>;
            } else {
                return;
            }

        };

        const singleTh = (day: string) => {

            return <th class={styles.weekdaytitle} scope="col">{day}</th>
        };

        const alldayTHs = () => {
            return this.weekDays.map((currDay: string) => {
                return singleTh(currDay);
            });
        }




        const dayCellWeekNumber = (currWeek: IMyWeek) => {

            // <td class="daycell daycellweeknbr" *ngIf="opts.showWeekNumbers&&opts.firstDayOfWeek==='mo'">{{w.weekNbr}}</td>
            let classStr = classNames(styles.daycell, styles.daycellweeknbr);
            if (this.opts.showWeekNumbers && this.opts.firstDayOfWeek === 'mo') {
                return <td class={classStr}>{currWeek.weekNbr}</td>
            } else {
                return;
            }
        }

        // 


        const markedDate = (d: IMyCalendarDay) => {
            /*
               <div *ngIf="d.markedDate.marked" 
                                      class="markdate" [ngStyle]="{'background-color': d.markedDate.color}"></div>*/

            //[ngStyle]="{'background-color': d.markedDate.color}"

            let style = {};
            style['background-color'] = d.markedDate.color;

            let backgroundColor: string = styles.backgroundColor;


            if (d.markedDate.marked) {
                return <div
                    class={styles.markdate} style={style}></div>
            } else {
                return;
            }

        };



        const dayWeek = (currWeek: IMyWeek, currDay: IMyCalendarDay) => {









            /*<td class="daycell" *ngFor="let d of w.week" 
            [ngClass]="{'currmonth':d.cmo===currMonthId&&!d.disabled,
             'selectedday':selectedDate.day===d.dateObj.day && selectedDate.month===d.dateObj.month && selectedDate.year===d.dateObj.year && d.cmo===currMonthId,
              'disabled': d.disabled, 
              'tablesingleday': d.cmo===currMonthId&&!d.disabled}"
               (click)="!d.disabled&&onCellClicked(d);$event.stopPropagation()" 
               (keydown)="onCellKeyDown($event, d)" tabindex="0">

                          <div *ngIf="d.markedDate.marked" 
                          class="markdate" [ngStyle]="{'background-color': d.markedDate.color}"></div>
                          <div class="datevalue" 
                          [ngClass]="{'prevmonth':d.cmo===prevMonthId,'currmonth':d.cmo===currMonthId,
                          'nextmonth':d.cmo===nextMonthId,'highlight':d.highlight}">

                              <span [ngClass]="{'currday':d.currDay&&opts.markCurrentDay,
                               'dimday': d.highlight && (d.cmo===prevMonthId || d.cmo===nextMonthId || d.disabled)}">{{d.dateObj.day}}</span>
                          </div>
                      </td>*/

            let onClickFunction;

            if (!currDay.disabled) {

                let that = this;
                onClickFunction = (e: Event) => {
                    that.onCellClicked.apply(that, [currDay]);
                    e.stopPropagation();

                }
            } else {
                onClickFunction = () => { }; // do nothing function
            }



            let onkeydownFunction = (e: Event) => {

                this.onCellKeyDown.apply(this, [e, currDay]);

            }

            let currmonthD1: string = styles.currmonth;
            let selecteddayD1: string = styles.selectedday;
            let disabledD1: string = styles.disabled;
            let tablesingledayD1: string = styles.tablesingleday;

            let ngClassStrD1 = classNames({ currmonthD1: currDay.cmo === this.currMonthId && !currDay.disabled },
                {
                    selecteddayD1: this.selectedDate.day === currDay.dateObj.day && this.selectedDate.month === currDay.dateObj.month
                    && this.selectedDate.year === currDay.dateObj.year && currDay.cmo === this.currMonthId
                },
                { disabledD1: currDay.disabled },
                { tablesingledayD1: currDay.cmo === this.currMonthId && !currDay.disabled }
            );







            let prevmonth: string = styles.prevmonth;
            let currmonth: string = styles.currmonth;
            let nextmonth: string = styles.nextmonth;
            let highlight: string = styles.highlight;

            let ngClassStrD2 = classNames({ prevmonth: currDay.cmo === this.prevMonthId },
                { currmonth: currDay.cmo === this.currMonthId },
                { nextmonth: currDay.cmo === this.nextMonthId },
                { highlight: currDay.highlight }
            );


            let currdayS: string = styles.currday;
            let dimdayS: string = styles.dimday;

            let ngClassStrS = classNames({ currdayS: currDay.currDay && this.opts.markCurrentDay },
                {
                    dimdayS: currDay.highlight && (currDay.cmo === this.prevMonthId ||
                        currDay.cmo === this.nextMonthId || currDay.disabled)
                });




            return <td class={styles.daycell + ' ' + this.processStyles(ngClassStrD1)} onClick={onClickFunction.bind(this)}
                onKeyDown={onkeydownFunction.bind(this)} tabIndex={0}>
                {markedDate(currDay)}
                <div class={styles.datevalue + ' ' + this.processStyles(ngClassStrD2)}>
                    <span class={this.processStyles(ngClassStrS)}>{currDay.dateObj.day}</span>

                </div>
            </td>



        }



        const singleWeekDays = (currWeek: IMyWeek) => {


            /*<td class="daycell daycellweeknbr" *ngIf="opts.showWeekNumbers&&opts.firstDayOfWeek==='mo'">{{w.weekNbr}}</td>
                             <td class="daycell" *ngFor="let d of w.week" [ngClass]="{'currmonth':d.cmo===currMonthId&&!d.disabled, 'selectedday':selectedDate.day===d.dateObj.day && selectedDate.month===d.dateObj.month && selectedDate.year===d.dateObj.year && d.cmo===currMonthId, 'disabled': d.disabled, 'tablesingleday': d.cmo===currMonthId&&!d.disabled}" (click)="!d.disabled&&onCellClicked(d);$event.stopPropagation()" (keydown)="onCellKeyDown($event, d)" tabindex="0">
                                 <div *ngIf="d.markedDate.marked" class="markdate" [ngStyle]="{'background-color': d.markedDate.color}"></div>
                                 <div class="datevalue" [ngClass]="{'prevmonth':d.cmo===prevMonthId,'currmonth':d.cmo===currMonthId,'nextmonth':d.cmo===nextMonthId,'highlight':d.highlight}">
                                     <span [ngClass]="{'currday':d.currDay&&opts.markCurrentDay, 'dimday': d.highlight && (d.cmo===prevMonthId || d.cmo===nextMonthId || d.disabled)}">{{d.dateObj.day}}</span>
                                 </div>
                             </td>*/


            return <tr>
                {dayCellWeekNumber(currWeek)}
                {currWeek.week.map((currDay: IMyCalendarDay) => {

                    return dayWeek(currWeek, currDay);

                })}
            </tr>

        }






        const restOfMonth = () => {
            /*<tbody>
                   <tr *ngFor="let w of dates">
                       <td class="daycell daycellweeknbr" *ngIf="opts.showWeekNumbers&&opts.firstDayOfWeek==='mo'">{{w.weekNbr}}</td>
                       <td class="daycell" *ngFor="let d of w.week" [ngClass]="{'currmonth':d.cmo===currMonthId&&!d.disabled, 'selectedday':selectedDate.day===d.dateObj.day && selectedDate.month===d.dateObj.month && selectedDate.year===d.dateObj.year && d.cmo===currMonthId, 'disabled': d.disabled, 'tablesingleday': d.cmo===currMonthId&&!d.disabled}" (click)="!d.disabled&&onCellClicked(d);$event.stopPropagation()" (keydown)="onCellKeyDown($event, d)" tabindex="0">
                           <div *ngIf="d.markedDate.marked" class="markdate" [ngStyle]="{'background-color': d.markedDate.color}"></div>
                           <div class="datevalue" [ngClass]="{'prevmonth':d.cmo===prevMonthId,'currmonth':d.cmo===currMonthId,'nextmonth':d.cmo===nextMonthId,'highlight':d.highlight}">
                               <span [ngClass]="{'currday':d.currDay&&opts.markCurrentDay, 'dimday': d.highlight && (d.cmo===prevMonthId || d.cmo===nextMonthId || d.disabled)}">{{d.dateObj.day}}</span>
                           </div>
                       </td>
                   </tr>
               </tbody>*/


            return <tbody>{this.dates.map((currWeek: IMyWeek) => {
                return singleWeekDays(currWeek);
            })}
            </tbody>
        }









        if (!this.selectMonth && !this.selectYear) {

            return <table class={styles.caltable}>
                <thead>
                    <tr>
                        {firstTH()}
                        {alldayTHs()}
                    </tr>
                </thead>
                {restOfMonth()}
            </table>

        } else {
            return;
        }




    }


    renderMonthTable() {

        /*<table class="monthtable" *ngIf="selectMonth">
         <tbody>
             <tr *ngFor="let mr of months">
                 <td class="monthcell tablesinglemonth" [ngClass]="{'selectedmonth': m.selected, 'disabled': m.disabled}" *ngFor="let m of mr"
                  (click)="!m.disabled&&onMonthCellClicked(m);$event.stopPropagation()" (keydown)="onMonthCellKeyDown($event, m)" tabindex="0">
                     <div class="monthvalue">{{m.name}}</div>
                 </td>
             </tr>
         </tbody>
     </table>*/

        const monthCellFrag = (m: IMyCalendarMonth) => {



            let onClickFunction;

            if (!m.disabled) {

                let that = this;
                onClickFunction = (e: Event) => {
                    that.onMonthCellClicked.apply(that, [m]);
                    e.stopPropagation();

                }
            } else {
                onClickFunction = () => { }; // do nothing function
            }


            let onkeydownFunction = (e: Event) => {

                this.onMonthCellKeyDown.apply(this, [e, m]);

            }

            let classStr = classNames(styles.monthcell, styles.tablesinglemonth);


            let selectedmonth: string = styles.selectedmonth;
            let disabled: string = styles.disabled;


            let ngClassStr = classNames({ selectedmonth: !m.selected },
                { disabled: m.disabled }
            );

            return <td class={classStr + ' ' + this.processStyles(ngClassStr)} onClick={onClickFunction.bind(this)}
                onKeyDown={onkeydownFunction.bind(this)} tabIndex={0}>
                <div class={styles.monthvalue}>{m.name}</div>
            </td>

        }



        const monthArrayFrag = (monthRow: IMyCalendarMonth[]) => {

            return <tr>
                {monthRow.map((m: IMyCalendarMonth) => {
                    return monthCellFrag(m);

                })}
            </tr>

        }

        if (this.selectMonth) {


            return <table class={styles.monthtable}>
                <tbody>
                    {this.months.map((monthRow: IMyCalendarMonth[]) => {
                        return monthArrayFrag(monthRow);
                    })
                    }
                </tbody>
            </table>
        } else {
            return;
        }



    }


    renderYearTable() {

        /*<table class="yeartable" *ngIf="selectYear">
     <tbody>
         <tr>
             <td colspan="5" class="yearchangebtncell" (click)="$event.stopPropagation()">
                 <button type="button" class="yearchangebtn mydpicon icon-mydpup" (click)="onPrevYears($event, years[0][0].year)" [disabled]="prevYearsDisabled" [ngClass]="{'yearchangebtnenabled': !prevYearsDisabled, 'yearchangebtndisabled': prevYearsDisabled}"></button>
             </td>
         </tr>
         <tr *ngFor="let yr of years">
             <td class="yearcell tablesingleyear" [ngClass]="{'selectedyear': y.selected, 'disabled': y.disabled}" *ngFor="let y of yr" (click)="!y.disabled&&onYearCellClicked(y);$event.stopPropagation()" (keydown)="onYearCellKeyDown($event, y)" tabindex="0">
                 <div class="yearvalue">{{y.year}}</div>
             </td>
         </tr>
         <tr>
             <td colspan="5" class="yearchangebtncell" (click)="$event.stopPropagation()">
                 <button type="button" class="yearchangebtn mydpicon icon-mydpdown" (click)="onNextYears($event, years[0][0].year)" [disabled]="nextYearsDisabled" [ngClass]="{'yearchangebtnenabled': !nextYearsDisabled, 'yearchangebtndisabled': nextYearsDisabled}"></button>
             </td>
         </tr>
     </tbody>
 </table>*/



        const yearChangeBtnCellTop = () => {

            /*<tr>
           <td colspan="5" class="yearchangebtncell" (click)="$event.stopPropagation()">
               <button type="button" class="yearchangebtn mydpicon icon-mydpup" (click)="onPrevYears($event, years[0][0].year)" [disabled]="prevYearsDisabled" [ngClass]="{'yearchangebtnenabled': !prevYearsDisabled, 'yearchangebtndisabled': prevYearsDisabled}"></button>
           </td>
           </tr>*/


            let onClickFunctionTD = (e: Event) => {

                e.stopPropagation();

            }



            let classStr = classNames(styles.yearchangebtn, styles.mydpicon, styles.iconMydpup);


            let yearchangebtnenabled: string = styles.yearchangebtnenabled;
            let yearchangebtndisabled: string = styles.yearchangebtndisabled;


            let ngClassStr = classNames({ yearchangebtnenabled: !this.prevYearsDisabled },
                { yearchangebtndisabled: this.prevYearsDisabled }
            );

            let onClickFunctionBtn = (e: Event) => {
                this.onPrevYears.apply(this, [e, this.years[0][0].year]);

            }



            return <tr>
                <td colSpan={5} class={styles.yearchangebtncell} onClick={onClickFunctionTD.bind(this)}>
                    <button type="button" class={classStr + ' ' + this.processStyles(ngClassStr)}
                        disabled={this.prevYearsDisabled} onClick={onClickFunctionBtn.bind(this)}>
                    </button>
                </td>
            </tr >



        }

        const yearCell = (y: IMyCalendarYear) => {

            /*<td class="yearcell tablesingleyear" [ngClass]="{'selectedyear': y.selected, 'disabled': y.disabled}"
             *ngFor="let y of yr" (click)="!y.disabled&&onYearCellClicked(y);$event.stopPropagation()"
              (keydown)="onYearCellKeyDown($event, y)" tabindex="0">
                <div class="yearvalue">{{y.year}}</div>
            </td>*/



            let classStr = classNames(styles.yearcell, styles.tablesingleyear);


            let selectedyear: string = styles.selectedyear;
            let disabled: string = styles.disabled;


            let ngClassStr = classNames({ selectedyear: y.selected },
                { disabled: y.disabled }
            );



            /**
             * Setup click function
             */
            let onClickFunction;

            if (!y.disabled) {

                let that = this;
                onClickFunction = (e: Event) => {
                    that.onYearCellClicked.apply(that, [y]);
                    e.stopPropagation();

                }
            } else {
                onClickFunction = () => { }; // do nothing function
            }


            let onkeydownFunction = (e: Event) => {

                this.onYearCellKeyDown.apply(this, [e, y]);

            }




            return <td class={classStr + ' ' + this.processStyles(ngClassStr)}
                onClick={onClickFunction.bind(this)}
                onKeyDown={onkeydownFunction.bind(this)} tabIndex={0}>
                <div class={styles.yearvalue}>{y.year}</div>
            </td>

        }

        const yearRowCells = (yr: IMyCalendarYear[]) => {


            /*<tr *ngFor="let yr of years">
                 <td class="yearcell tablesingleyear" [ngClass]="{'selectedyear': y.selected, 'disabled': y.disabled}"
                  *ngFor="let y of yr" (click)="!y.disabled&&onYearCellClicked(y);$event.stopPropagation()"
                   (keydown)="onYearCellKeyDown($event, y)" tabindex="0">
                     <div class="yearvalue">{{y.year}}</div>
                 </td>
             </tr>*/


            return <tr >
                {yr.map((year: IMyCalendarYear) => {
                    return yearCell(year);
                })}
            </tr>

        }

        const yearChangeBtnCellBottom = () => {


            /*<tr>
                <td colspan="5" class="yearchangebtncell" (click)="$event.stopPropagation()">
                    <button type="button" class="yearchangebtn mydpicon icon-mydpdown" 
                    (click)="onNextYears($event, years[0][0].year)" [disabled]="nextYearsDisabled"
                     [ngClass]="{'yearchangebtnenabled': !nextYearsDisabled, 'yearchangebtndisabled': nextYearsDisabled}">
                   </button>
                </td>
            </tr>            */


            let onClickFunctionTD = (e: Event) => {

                e.stopPropagation();

            }



            let classStr = classNames(styles.yearchangebtn, styles.mydpicon, styles.iconMydpdown);


            let yearchangebtnenabled: string = styles.yearchangebtnenabled;
            let yearchangebtndisabled: string = styles.yearchangebtndisabled;


            let ngClassStr = classNames({ yearchangebtnenabled: !this.nextYearsDisabled },
                { yearchangebtndisabled: this.nextYearsDisabled }
            );

            let onClickFunctionBtn = (e: Event) => {
                this.onNextYears.apply(this, [e, this.years[0][0].year]);

            }



            return <tr>
                <td colSpan={5} class={styles.yearchangebtncell} onClick={onClickFunctionTD.bind(this)}>
                    <button type="button" class={classStr + ' ' + this.processStyles(ngClassStr)}
                        disabled={this.nextYearsDisabled} onClick={onClickFunctionBtn.bind(this)}>
                    </button>
                </td>
            </tr >


        }

        if (this.selectYear) {
            return <table class={styles.yeartable} >
                <tbody>
                    {yearChangeBtnCellTop()}
                    {this.years.map((yearRow: IMyCalendarYear[]) => {
                        return yearRowCells(yearRow);
                    })}
                    {yearChangeBtnCellBottom()}


                </tbody>
            </table>
        }

    }













    //    constructor(public elem: ElementRef, private renderer: Renderer, private cdr: ChangeDetectorRef, private localeService: LocaleService, private utilService: UtilService) {
    //         this.setLocaleOptions();
    //         renderer.listenGlobal("document", "click", (event: any) => {
    //             if (this.showSelector && event.target && this.elem.nativeElement !== event.target && !this.elem.nativeElement.contains(event.target)) {
    //                 this.showSelector = false;
    //                 this.calendarToggle.emit(CalToggle.CloseByOutClick);
    //             }
    //             if (this.opts.monthSelector || this.opts.yearSelector) {
    //                 this.resetMonthYearSelect();
    //             }
    //         });
    //     }

    setLocaleOptions(): void {
        let opts: IMyOptions = this.localeService.getLocaleOptions(this.locale);
        Object.keys(opts).forEach((k) => {
            (this.opts)[k] = opts[k];
        });
    }

    setOptions(): void {
        if (this.options !== undefined) {
            Object.keys(this.options).forEach((k) => {
                (this.opts)[k] = this.options[k];
            });
        }
        if (this.opts.minYear < Year.min) {
            this.opts.minYear = Year.min;
        }
        if (this.opts.maxYear > Year.max) {
            this.opts.maxYear = Year.max;
        }
        if (this.disabled !== undefined) {
            this.opts.componentDisabled = this.disabled;
        }
    }

    getSelectorTopPosition(): string {
        if (this.opts.openSelectorTopOfInput) {

            //MG 

            return '';
            //return this.elem.nativeElement.children[0].offsetHeight + "px";
        }
    }

    resetMonthYearSelect(): void {
        this.selectMonth = false;
        this.selectYear = false;
    }

    onSelectMonthClicked(event: any): void {
        event.stopPropagation();
        this.selectMonth = !this.selectMonth;
        this.selectYear = false;
        //MG this.cdr.detectChanges();
        // MG
        this.setState({});
        if (this.selectMonth) {
            this.months.length = 0;
            for (let i = 1; i <= 12; i += 3) {
                let row: Array<IMyCalendarMonth> = [];
                for (let j = i; j < i + 3; j++) {
                    let disabled: boolean = this.utilService.isMonthDisabledByDisableUntil({ year: this.visibleMonth.year, month: j, day: this.daysInMonth(j, this.visibleMonth.year) }, this.opts.disableUntil)
                        || this.utilService.isMonthDisabledByDisableSince({ year: this.visibleMonth.year, month: j, day: 1 }, this.opts.disableSince);
                    row.push({ nbr: j, name: this.opts.monthLabels[j], selected: j === this.visibleMonth.monthNbr, disabled: disabled });
                }
                this.months.push(row);
            }
        }
    }

    onMonthCellClicked(cell: IMyCalendarMonth): void {
        let mc: boolean = cell.nbr !== this.visibleMonth.monthNbr;
        this.visibleMonth = { monthTxt: this.monthText(cell.nbr), monthNbr: cell.nbr, year: this.visibleMonth.year };
        this.generateCalendar(cell.nbr, this.visibleMonth.year, mc);
        this.selectMonth = false;

        //MG this.selectorEl.nativeElement.focus();
    }

    onMonthCellKeyDown(event: any, cell: IMyCalendarMonth) {
        if ((event.keyCode === KeyCode.enter || event.keyCode === KeyCode.space) && !cell.disabled) {
            event.preventDefault();
            this.onMonthCellClicked(cell);
        }
    }

    onSelectYearClicked(event: any): void {
        event.stopPropagation();
        this.selectYear = !this.selectYear;
        this.selectMonth = false;
        //MG this.cdr.detectChanges();
        if (this.selectYear) {
            this.generateYears(this.visibleMonth.year);
        }

        // MG
        this.setState({});
    }

    onYearCellClicked(cell: IMyCalendarYear): void {
        let yc: boolean = cell.year !== this.visibleMonth.year;
        this.visibleMonth = { monthTxt: this.visibleMonth.monthTxt, monthNbr: this.visibleMonth.monthNbr, year: cell.year };
        this.generateCalendar(this.visibleMonth.monthNbr, cell.year, yc);
        this.selectYear = false;
        //MG this.selectorEl.nativeElement.focus();
    }

    onYearCellKeyDown(event: any, cell: IMyCalendarYear) {
        if ((event.keyCode === KeyCode.enter || event.keyCode === KeyCode.space) && !cell.disabled) {
            event.preventDefault();
            this.onYearCellClicked(cell);
        }
    }

    onPrevYears(event: any, year: number): void {
        event.stopPropagation();
        this.generateYears(year - 25);
    }

    onNextYears(event: any, year: number): void {
        event.stopPropagation();
        this.generateYears(year + 25);
    }

    generateYears(year: number): void {
        this.years.length = 0;
        for (let i = year; i <= 20 + year; i += 5) {
            let row: Array<IMyCalendarYear> = [];
            for (let j = i; j < i + 5; j++) {
                let disabled: boolean = this.utilService.isMonthDisabledByDisableUntil({ year: j, month: this.visibleMonth.monthNbr, day: this.daysInMonth(this.visibleMonth.monthNbr, j) }, this.opts.disableUntil)
                    || this.utilService.isMonthDisabledByDisableSince({ year: j, month: this.visibleMonth.monthNbr, day: 1 }, this.opts.disableSince);
                let minMax: boolean = j < this.opts.minYear || j > this.opts.maxYear;
                row.push({ year: j, selected: j === this.visibleMonth.year, disabled: disabled || minMax });
            }
            this.years.push(row);
        }
        this.prevYearsDisabled = this.years[0][0].year <= this.opts.minYear || this.utilService.isMonthDisabledByDisableUntil({ year: this.years[0][0].year - 1, month: this.visibleMonth.monthNbr, day: this.daysInMonth(this.visibleMonth.monthNbr, this.years[0][0].year - 1) }, this.opts.disableUntil);
        this.nextYearsDisabled = this.years[4][4].year >= this.opts.maxYear || this.utilService.isMonthDisabledByDisableSince({ year: this.years[4][4].year + 1, month: this.visibleMonth.monthNbr, day: 1 }, this.opts.disableSince);

        // MG
        this.setState({});
    }

    onUserDateInput(value: string): void {
        this.invalidDate = false;
        if (value.length === 0) {
            this.clearDate();
        }
        else {
            let date: IMyDate = this.utilService.isDateValid(value, this.opts.dateFormat, this.opts.minYear, this.opts.maxYear, this.opts.disableUntil, this.opts.disableSince, this.opts.disableWeekends, this.opts.disableDays, this.opts.disableDateRanges, this.opts.monthLabels, this.opts.enableDays);
            if (date.day !== 0 && date.month !== 0 && date.year !== 0) {
                this.selectDate(date, CalToggle.CloseByDateSel);
            }
            else {
                this.invalidDate = true;
            }
        }
        if (this.invalidDate) {
            //MG this.inputFieldChanged.emit({value: value, dateFormat: this.opts.dateFormat, valid: !(value.length === 0 || this.invalidDate)});
            this.onChangeCb(null);
            this.onTouchedCb();
        }
    }

    onFocusInput(event: any): void {
        //MG this.inputFocusBlur.emit({reason: InputFocusBlur.focus, value: event.target.value});
    }

    onBlurInput(event: any): void {
        this.selectionDayTxt = event.target.value;
        this.onTouchedCb();
        //MG this.inputFocusBlur.emit({reason: InputFocusBlur.blur, value: event.target.value});
    }

    onCloseSelector(event: any): void {
        if (event.keyCode === KeyCode.esc && this.showSelector && !this.opts.inline) {
            //MG    this.calendarToggle.emit(CalToggle.CloseByEsc);
            this.showSelector = false;
        }
    }

    isTodayDisabled(): void {
        this.disableTodayBtn = this.utilService.isDisabledDay(this.getToday(), this.opts.disableUntil,
            this.opts.disableSince, this.opts.disableWeekends, this.opts.disableDays, this.opts.disableDateRanges, this.opts.enableDays);
    }

    parseOptions(): void {
        if (this.locale) {
            this.setLocaleOptions();
        }
        this.setOptions();
        this.isTodayDisabled();
        this.dayIdx = this.weekDayOpts.indexOf(this.opts.firstDayOfWeek);
        if (this.dayIdx !== -1) {
            let idx: number = this.dayIdx;
            for (let i = 0; i < this.weekDayOpts.length; i++) {
                this.weekDays.push(this.opts.dayLabels[this.weekDayOpts[idx]]);
                idx = this.weekDayOpts[idx] === "sa" ? 0 : idx + 1;
            }
        }
    }

    writeValue(value: Object): void {
        if (value && value["date"]) {
            this.selectedDate = this.parseSelectedDate(value["date"]);
            let cvc: boolean = this.visibleMonth.year !== this.selectedDate.year || this.visibleMonth.monthNbr !== this.selectedDate.month;
            if (cvc) {
                this.visibleMonth = { monthTxt: this.opts.monthLabels[this.selectedDate.month], monthNbr: this.selectedDate.month, year: this.selectedDate.year };
                this.generateCalendar(this.selectedDate.month, this.selectedDate.year, cvc);
            }
            if (!this.opts.inline) {
                this.updateDateValue(this.selectedDate, false);
            }
        }
        else if (value === null || value === "") {
            if (!this.opts.inline) {
                this.updateDateValue({ year: 0, month: 0, day: 0 }, true);
            }
            else {
                this.selectedDate = { year: 0, month: 0, day: 0 };
            }
        }
    }

    setDisabledState(disabled: boolean): void {
        this.opts.componentDisabled = disabled;
    }

    registerOnChange(fn: any): void {
        this.onChangeCb = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCb = fn;
    }

    //MG
    // ngOnChanges(changes: SimpleChanges): void {
    //     if (changes.hasOwnProperty("selector") && changes["selector"].currentValue > 0) {
    //         this.openBtnClicked();
    //     }

    //     if (changes.hasOwnProperty("placeholder")) {
    //         this.placeholder = changes["placeholder"].currentValue;
    //     }

    //     if (changes.hasOwnProperty("locale")) {
    //         this.locale = changes["locale"].currentValue;
    //     }

    //     if (changes.hasOwnProperty("disabled")) {
    //         this.disabled = changes["disabled"].currentValue;
    //     }

    //     if (changes.hasOwnProperty("options")) {
    //         this.options = changes["options"].currentValue;
    //     }

    //     this.weekDays.length = 0;
    //     this.parseOptions();

    //     if (changes.hasOwnProperty("defaultMonth")) {
    //         let dm: string = changes["defaultMonth"].currentValue;
    //         if (dm !== null && dm !== undefined && dm !== "") {
    //             this.selectedMonth = this.parseSelectedMonth(dm);
    //         }
    //         else {
    //             this.selectedMonth = {monthTxt: "", monthNbr: 0, year: 0};
    //         }
    //     }

    //     if (changes.hasOwnProperty("selDate")) {
    //         let sd: any = changes["selDate"];
    //         if (sd.currentValue !== null && sd.currentValue !== undefined && sd.currentValue !== "" && Object.keys(sd.currentValue).length !== 0) {
    //             this.selectedDate = this.parseSelectedDate(sd.currentValue);
    //             setTimeout(() => {
    //                 this.onChangeCb(this.getDateModel(this.selectedDate));
    //             });
    //         }
    //         else {
    //             // Do not clear on init
    //             if (!sd.isFirstChange()) {
    //                 this.clearDate();
    //             }
    //         }
    //     }
    //     if (this.opts.inline) {
    //         this.setVisibleMonth();
    //     }
    //     else if (this.showSelector) {
    //         this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year, false);
    //     }
    // }

    removeBtnClicked(): void {
        // Remove date button clicked
        this.clearDate();
        //MG
        // if (this.showSelector) {
        //     this.calendarToggle.emit(CalToggle.CloseByCalBtn);
        // }
        this.showSelector = false;
    }

    onDecreaseBtnClicked(): void {
        // Decrease date button clicked
        this.decreaseIncreaseDate(true);
    }

    onIncreaseBtnClicked(): void {
        // Increase date button clicked
        this.decreaseIncreaseDate(false);
    }

    openBtnClicked(): void {
        // Open selector button clicked

        this.showSelector = !this.showSelector;

        this.setState({});
        //MG this.cdr.detectChanges();
        if (this.showSelector) {
            this.setVisibleMonth();
            //MG     this.calendarToggle.emit(CalToggle.Open);
        }
        else {
            //MG    this.calendarToggle.emit(CalToggle.CloseByCalBtn);
        }
    }

    setVisibleMonth(): void {
        // Sets visible month of calendar
        let y: number = 0, m: number = 0;
        if (!this.utilService.isInitializedDate(this.selectedDate)) {
            if (this.selectedMonth.year === 0 && this.selectedMonth.monthNbr === 0) {
                let today: IMyDate = this.getToday();
                y = today.year;
                m = today.month;
            } else {
                y = this.selectedMonth.year;
                m = this.selectedMonth.monthNbr;
            }
        }
        else {
            y = this.selectedDate.year;
            m = this.selectedDate.month;
        }
        this.visibleMonth = { monthTxt: this.opts.monthLabels[m], monthNbr: m, year: y };

        // Create current month
        this.generateCalendar(m, y, true);
    }

    onPrevMonth(): void {
        // Previous month from calendar
        let d: Date = this.getDate(this.visibleMonth.year, this.visibleMonth.monthNbr, 1);
        d.setMonth(d.getMonth() - 1);

        let y: number = d.getFullYear();
        let m: number = d.getMonth() + 1;

        this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
        this.generateCalendar(m, y, true);
    }

    onNextMonth(): void {
        // Next month from calendar
        let d: Date = this.getDate(this.visibleMonth.year, this.visibleMonth.monthNbr, 1);
        d.setMonth(d.getMonth() + 1);

        let y: number = d.getFullYear();
        let m: number = d.getMonth() + 1;

        this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
        this.generateCalendar(m, y, true);
    }

    onPrevYear(): void {
        // Previous year from calendar
        this.visibleMonth.year--;
        this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year, true);
    }

    onNextYear(): void {
        // Next year from calendar
        this.visibleMonth.year++;
        this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year, true);
    }

    onTodayClicked(): void {
        // Today button clicked
        let today: IMyDate = this.getToday();
        this.selectDate(today, CalToggle.CloseByDateSel);
        if (this.opts.inline && today.year !== this.visibleMonth.year || today.month !== this.visibleMonth.monthNbr) {
            this.visibleMonth = { monthTxt: this.opts.monthLabels[today.month], monthNbr: today.month, year: today.year };
            this.generateCalendar(today.month, today.year, true);
        }
    }

    onCellClicked(cell: any): void {
        // Cell clicked on the calendar
        if (cell.cmo === this.prevMonthId) {
            // Previous month day
            this.onPrevMonth();
        }
        else if (cell.cmo === this.currMonthId) {
            // Current month day - if date is already selected clear it
            if (this.utilService.isSameDate(cell.dateObj, this.selectedDate)) {
                this.clearDate();
            }
            else {
                this.selectDate(cell.dateObj, CalToggle.CloseByDateSel);
            }
        }
        else if (cell.cmo === this.nextMonthId) {
            // Next month day
            this.onNextMonth();
        }
        this.resetMonthYearSelect();
    }

    onCellKeyDown(event: any, cell: any) {
        // Cell keyboard handling
        if ((event.keyCode === KeyCode.enter || event.keyCode === KeyCode.space) && !cell.disabled) {
            event.preventDefault();
            this.onCellClicked(cell);
        }
    }

    clearDate(): void {
        // Clears the date and notifies parent using callbacks and value accessor
        let date: IMyDate = { year: 0, month: 0, day: 0 };
        //MG   this.dateChanged.emit({date: date, jsdate: null, formatted: "", epoc: 0});
        this.onChangeCb(null);
        this.onTouchedCb();
        this.updateDateValue(date, true);
    }

    decreaseIncreaseDate(decrease: boolean): void {
        // Decreases or increases the date depending on the parameter
        let date: IMyDate = this.selectedDate;
        if (this.utilService.isInitializedDate(date)) {
            let d: Date = this.getDate(date.year, date.month, date.day);
            d.setDate(decrease ? d.getDate() - 1 : d.getDate() + 1);
            date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
        }
        else {
            date = this.getToday();
        }
        this.selectDate(date, CalToggle.CloseByCalBtn);
    }

    selectDate(date: IMyDate, closeReason: number): void {
        // Date selected, notifies parent using callbacks and value accessor
        let dateModel: IMyDateModel = this.getDateModel(date);
        //MG      this.dateChanged.emit(dateModel);
        this.onChangeCb(dateModel);
        this.onTouchedCb();
        this.updateDateValue(date, false);
        if (this.showSelector) {
            //MG         this.calendarToggle.emit(closeReason);
        }
        this.showSelector = false;
    }

    updateDateValue(date: IMyDate, clear: boolean): void {
        // Updates date values
        this.selectedDate = date;
        this.selectionDayTxt = clear ? "" : this.formatDate(date);
        //MG       this.inputFieldChanged.emit({value: this.selectionDayTxt, dateFormat: this.opts.dateFormat, valid: !clear});
        this.invalidDate = false;

        //MG
        this.setState({});
    }

    getDateModel(date: IMyDate): IMyDateModel {
        // Creates a date model object from the given parameter
        return { date: date, jsdate: this.getDate(date.year, date.month, date.day), formatted: this.formatDate(date), epoc: Math.round(this.getTimeInMilliseconds(date) / 1000.0) };
    }

    preZero(val: string): string {
        // Prepend zero if smaller than 10
        return parseInt(val) < 10 ? "0" + val : val;
    }

    formatDate(val: any): string {
        // Returns formatted date string, if mmm is part of dateFormat returns month as a string
        let formatted: string = this.opts.dateFormat.replace(YYYY, val.year).replace(DD, this.preZero(val.day));
        let retFormattedDate = this.opts.dateFormat.indexOf(MMM) !== -1 ? formatted.replace(MMM, this.monthText(val.month)) : formatted.replace(MM, this.preZero(val.month));
        return this.opts.dateFormat.indexOf(MMM) !== -1 ? formatted.replace(MMM, this.monthText(val.month)) : formatted.replace(MM, this.preZero(val.month));
    }

    monthText(m: number): string {
        // Returns month as a text
        return this.opts.monthLabels[m];
    }

    monthStartIdx(y: number, m: number): number {
        // Month start index
        let d = new Date();
        d.setDate(1);
        d.setMonth(m - 1);
        d.setFullYear(y);
        let idx = d.getDay() + this.sundayIdx();
        return idx >= 7 ? idx - 7 : idx;
    }

    daysInMonth(m: number, y: number): number {
        // Return number of days of current month
        return new Date(y, m, 0).getDate();
    }

    daysInPrevMonth(m: number, y: number): number {
        // Return number of days of the previous month
        let d: Date = this.getDate(y, m, 1);
        d.setMonth(d.getMonth() - 1);
        return this.daysInMonth(d.getMonth() + 1, d.getFullYear());
    }

    isCurrDay(d: number, m: number, y: number, cmo: number, today: IMyDate): boolean {
        // Check is a given date the today
        return d === today.day && m === today.month && y === today.year && cmo === this.currMonthId;
    }

    getToday(): IMyDate {
        let date: Date = new Date();
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }

    getTimeInMilliseconds(date: IMyDate): number {
        return this.getDate(date.year, date.month, date.day).getTime();
    }

    getWeekday(date: IMyDate): string {
        // Get weekday: su, mo, tu, we ...
        return this.weekDayOpts[this.utilService.getDayNumber(date)];
    }

    getDate(year: number, month: number, day: number): Date {
        // Creates a date object from given year, month and day
        return new Date(year, month - 1, day, 0, 0, 0, 0);
    }

    sundayIdx(): number {
        // Index of Sunday day
        return this.dayIdx > 0 ? 7 - this.dayIdx : 0;
    }

    generateCalendar(m: number, y: number, notifyChange: boolean): void {
        this.dates.length = 0;
        let today: IMyDate = this.getToday();
        let monthStart: number = this.monthStartIdx(y, m);
        let dInThisM: number = this.daysInMonth(m, y);
        let dInPrevM: number = this.daysInPrevMonth(m, y);

        let dayNbr: number = 1;
        let cmo: number = this.prevMonthId;
        for (let i = 1; i < 7; i++) {
            let week: Array<IMyCalendarDay> = [];
            if (i === 1) {
                // First week
                let pm = dInPrevM - monthStart + 1;
                // Previous month
                for (let j = pm; j <= dInPrevM; j++) {
                    let date: IMyDate = { year: y, month: m - 1, day: j };
                    week.push({
                        dateObj: date, cmo: cmo, currDay: this.isCurrDay(j, m, y, cmo, today),
                        disabled: this.utilService.isDisabledDay(date, this.opts.disableUntil, this.opts.disableSince, this.opts.disableWeekends, this.opts.disableDays, this.opts.disableDateRanges, this.opts.enableDays),
                        markedDate: this.utilService.isMarkedDate(date, this.opts.markDates, this.opts.markWeekends),
                        highlight: this.utilService.isHighlightedDate(date, this.opts.sunHighlight, this.opts.satHighlight, this.opts.highlightDates)
                    });
                }

                cmo = this.currMonthId;
                // Current month
                let daysLeft: number = 7 - week.length;
                for (let j = 0; j < daysLeft; j++) {
                    let date: IMyDate = { year: y, month: m, day: dayNbr };
                    week.push({
                        dateObj: date, cmo: cmo, currDay: this.isCurrDay(dayNbr, m, y, cmo, today),
                        disabled: this.utilService.isDisabledDay(date, this.opts.disableUntil, this.opts.disableSince, this.opts.disableWeekends, this.opts.disableDays, this.opts.disableDateRanges, this.opts.enableDays),
                        markedDate: this.utilService.isMarkedDate(date, this.opts.markDates, this.opts.markWeekends),
                        highlight: this.utilService.isHighlightedDate(date, this.opts.sunHighlight, this.opts.satHighlight, this.opts.highlightDates)
                    });
                    dayNbr++;
                }
            }
            else {
                // Rest of the weeks
                for (let j = 1; j < 8; j++) {
                    if (dayNbr > dInThisM) {
                        // Next month
                        dayNbr = 1;
                        cmo = this.nextMonthId;
                    }
                    let date: IMyDate = { year: y, month: cmo === this.currMonthId ? m : m + 1, day: dayNbr };
                    week.push({
                        dateObj: date, cmo: cmo, currDay: this.isCurrDay(dayNbr, m, y, cmo, today),
                        disabled: this.utilService.isDisabledDay(date, this.opts.disableUntil, this.opts.disableSince, this.opts.disableWeekends, this.opts.disableDays, this.opts.disableDateRanges, this.opts.enableDays),
                        markedDate: this.utilService.isMarkedDate(date, this.opts.markDates, this.opts.markWeekends),
                        highlight: this.utilService.isHighlightedDate(date, this.opts.sunHighlight, this.opts.satHighlight, this.opts.highlightDates)
                    });
                    dayNbr++;
                }
            }
            let weekNbr: number = this.opts.showWeekNumbers && this.opts.firstDayOfWeek === "mo" ? this.utilService.getWeekNumber(week[0].dateObj) : 0;
            this.dates.push({ week: week, weekNbr: weekNbr });
        }

        this.setHeaderBtnDisabledState(m, y);

        // MG -11
        this.setState({});

        if (notifyChange) {
            // Notify parent
            //MG      this.calendarViewChanged.emit({year: y, month: m, first: {number: 1, weekday: this.getWeekday({year: y, month: m, day: 1})}, last: {number: dInThisM, weekday: this.getWeekday({year: y, month: m, day: dInThisM})}});
        }
    }

    parseSelectedDate(selDate: any): IMyDate {
        // Parse selDate value - it can be string or IMyDate object
        let date: IMyDate = { day: 0, month: 0, year: 0 };
        if (typeof selDate === "string") {
            let sd: string = selDate as string;
            let df: string = this.opts.dateFormat;

            date.month = df.indexOf(MMM) !== -1
                ? this.utilService.parseDatePartMonthName(df, sd, MMM, this.opts.monthLabels)
                : this.utilService.parseDatePartNumber(df, sd, MM);

            if (df.indexOf(MMM) !== -1 && this.opts.monthLabels[date.month]) {
                df = this.utilService.changeDateFormat(df, this.opts.monthLabels[date.month].length);
            }

            date.day = this.utilService.parseDatePartNumber(df, sd, DD);
            date.year = this.utilService.parseDatePartNumber(df, sd, YYYY);
        }
        else if (typeof selDate === "object") {
            date = selDate;
        }
        this.selectionDayTxt = this.formatDate(date);
        return date;
    }

    parseSelectedMonth(ms: string): IMyMonth {
        return this.utilService.parseDefaultMonth(ms);
    }

    setHeaderBtnDisabledState(m: number, y: number): void {
        let dpm: boolean = false;
        let dpy: boolean = false;
        let dnm: boolean = false;
        let dny: boolean = false;
        if (this.opts.disableHeaderButtons) {
            dpm = this.utilService.isMonthDisabledByDisableUntil({ year: m === 1 ? y - 1 : y, month: m === 1 ? 12 : m - 1, day: this.daysInMonth(m === 1 ? 12 : m - 1, m === 1 ? y - 1 : y) }, this.opts.disableUntil);
            dpy = this.utilService.isMonthDisabledByDisableUntil({ year: y - 1, month: m, day: this.daysInMonth(m, y - 1) }, this.opts.disableUntil);
            dnm = this.utilService.isMonthDisabledByDisableSince({ year: m === 12 ? y + 1 : y, month: m === 12 ? 1 : m + 1, day: 1 }, this.opts.disableSince);
            dny = this.utilService.isMonthDisabledByDisableSince({ year: y + 1, month: m, day: 1 }, this.opts.disableSince);
        }
        this.prevMonthDisabled = m === 1 && y === this.opts.minYear || dpm;
        this.prevYearDisabled = y - 1 < this.opts.minYear || dpy;
        this.nextMonthDisabled = m === 12 && y === this.opts.maxYear || dnm;
        this.nextYearDisabled = y + 1 > this.opts.maxYear || dny;
    }



    /**
     * Process raw styles from classNames util to fetch those run via 
     * css modules
     * @param inputStyle 
     */
    processStyles(inputStyle: string): string {
        if (!!inputStyle) {

            let styles_array = inputStyle.trim().split(' ');
            let processed_array = styles_array.map((val: string) => {
                return styles[val];
                            
            });
           

            return processed_array.join(' ');
        }

        // not a valid input - return empty style string
        return '';
    }


}
