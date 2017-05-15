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

import { IMyDayLabels } from "./my-day-labels.interface";
import { IMyMonthLabels } from "./my-month-labels.interface";
import { IMyDate } from "./my-date.interface";
import { IMyDateRange } from "./my-date-range.interface";
import { IMyMarkedDates } from "./my-marked-dates.interface";
import { IMyMarkedDate } from "./my-marked-date.interface";

export interface IMyOptions {
    dayLabels?: IMyDayLabels;
    monthLabels?: IMyMonthLabels;
    dateFormat?: string;
    showTodayBtn?: boolean;
    todayBtnTxt?: string;
    firstDayOfWeek?: string;
    satHighlight?: boolean;
    sunHighlight?: boolean;
    highlightDates?: Array<IMyDate>;
    markCurrentDay?: boolean;
    disableUntil?: IMyDate;
    disableSince?: IMyDate;
    disableDays?: Array<IMyDate>;
    enableDays?: Array<IMyDate>;
    markDates?: Array<IMyMarkedDates>;
    markWeekends?: IMyMarkedDate;
    disableDateRanges?: Array<IMyDateRange>;
    disableWeekends?: boolean;
    showWeekNumbers?: boolean;
    height?: string;
    width?: string;
    selectionTxtFontSize?: string;
    inline?: boolean;
    showClearDateBtn?: boolean;
    showDecreaseDateBtn?: boolean;
    showIncreaseDateBtn?: boolean;
    alignSelectorRight?: boolean;
    openSelectorTopOfInput?: boolean;
    indicateInvalidDate?: boolean;
    editableDateField?: boolean;
    monthSelector?: boolean;
    yearSelector?: boolean;
    disableHeaderButtons?: boolean;
    minYear?: number;
    maxYear?: number;
    componentDisabled?: boolean;
    showSelectorArrow?: boolean;
    showInputField?: boolean;
    openSelectorOnInputClick?: boolean;
    ariaLabelInputField?: string;
    ariaLabelClearDate?: string;
    ariaLabelDecreaseDate?: string;
    ariaLabelIncreaseDate?: string;
    ariaLabelOpenCalendar?: string;
    ariaLabelPrevMonth?: string;
    ariaLabelNextMonth?: string;
    ariaLabelPrevYear?: string;
    ariaLabelNextYear?: string;
}
