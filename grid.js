class Grid {
    constructor(tableData) {
        this.wrapper = tableData.wrapper;
        this.tableCols = tableData.columns;
        this.tableRows = tableData.rows;
        this.table = null;
        this.initTable();
        this.addSortListener();
        this.addDeleteListener();
        this.addForm();
        this.sortedBy = {
            column: null,
            sortOrderAscending: true
        };
    }

    initTable() {
        let table = document.createElement('table');
        table.classList.add('grid-table');

        table.append(this.makeTableHeader(), this.makeTableBody());

        this.table = table;



        this.wrapper.appendChild(table);
    }

    makeTableHeader() {
        let header = document.createElement('thead'),
            row = header.insertRow(0),
            th = document.createElement('th');
        this.tableCols.forEach((item, index) => {
            let currentTh = th.cloneNode();
            currentTh.innerHTML = item;
            currentTh.dataset.columnName = item;
            currentTh.dataset.cellColumn = index;
            row.appendChild(currentTh);
        });
        return header;
    }

    makeTableBody() {
        let body = document.createElement('tbody'),
            rowArray = this.tableRows.map(rowObj => {
                let currentRowData = Object.keys(rowObj).map(key => rowObj[key]);
                return this.makeTableRow(...currentRowData);
            });
        body.append(...rowArray);
        return body;
    }

    makeTableRow(...rowData) {
        let currentRow = document.createElement('tr');
        currentRow.dataset.rowName = rowData[0];
        rowData.forEach((data, index) => {
            let currentCell = currentRow.insertCell();
            currentCell.dataset.cellColumn = index;
            currentCell.dataset.cellData = data;
            currentCell.innerHTML = styleCellData(data);
        });
        let button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.classList.add('btn-delete-row');
        button.innerText = 'X';
        currentRow.lastChild.append(button);

        return currentRow;
    }



    sortRows(clickedColumn) {
        let columnData = [...this.table.querySelectorAll(`td[data-cell-column='${clickedColumn}']`)],
            sortFunction;

        if (this.sortedBy.column !== clickedColumn) {
            sortFunction = sortAscending;
            this.sortedBy.sortOrderAscending = true;
        } else {
            if (this.sortedBy.sortOrderAscending) {
                sortFunction = sortDescending;
                this.sortedBy.sortOrderAscending = false;
            } else if (!this.sortedBy.sortOrderAscending) {
                sortFunction = sortAscending;
                this.sortedBy.sortOrderAscending = true;
            }
        }

        this.sortedBy.column = clickedColumn;
        columnData.sort(sortFunction);

        let tbody = this.table.querySelector('tbody');
        tbody.innerHTML = '';

        let sortedFragment = columnData.reduce((fragment, val) => {
            fragment.appendChild(val.parentElement);
            return fragment;
        }, document.createDocumentFragment());

        tbody.appendChild(sortedFragment);
    }


    addSortListener() {
        this.table.querySelector('thead').addEventListener('click', e => {
            if (e.target.tagName === 'TH') {
                [...e.target.parentNode.childNodes].forEach(i => i.classList.remove('sorted-by'));
                e.target.classList.add('sorted-by');
                this.sortRows(e.target.dataset.cellColumn);
            }
        });
    }

    addDeleteListener() {
        this.table.querySelector('tbody').addEventListener('click', e => {
            if (e.target.tagName === 'BUTTON') {
                e.target.closest('tr').remove();
            }
        });
    }

    addForm() {
        let form = document.createElement('form'),
            divInputGroup = document.createElement('div'),
            input = document.createElement('input'),
            label = document.createElement('label'),
            button = document.createElement('button');

        form.classList.add('form-add-new-row');
        input.required = true;
        button.setAttribute('type', 'submit');
        button.innerText = 'Add new table row';

        let inputGroups = this.tableCols.map(column => {
                let currentInput = input.cloneNode(true),
                    currentLabel = label.cloneNode(),
                    currentInputGroup = divInputGroup.cloneNode();
                currentInput.id = column;

                currentLabel.setAttribute('for', column);
                currentLabel.innerText = column + ': ';

                currentInputGroup.append(currentLabel, currentInput);
                return currentInputGroup;
            });

        form.append(...inputGroups, button);

        form.addEventListener('submit', e => {
           e.preventDefault();
           let inputs = [...e.target.elements];
           inputs.pop();
           let inputsValues = inputs.map(input => input.value);
           form.reset();
           this.addNewRow(...inputsValues);
        });

        this.wrapper.appendChild(form);
    }

    addNewRow(...args) {
        if (args.length === this.tableCols.length) {
            let tableRow = this.makeTableRow(...args),
                columnSortedBy = [...this.table.querySelectorAll(`td[data-cell-column='${this.sortedBy.column}']`)],
                insertedRowSortCell = tableRow.querySelector(`td[data-cell-column='${this.sortedBy.column}']`);

            columnSortedBy.push(insertedRowSortCell);

            this.sortedBy.sortOrderAscending ? columnSortedBy.sort(sortAscending) : columnSortedBy.sort(sortDescending);

            let tbody = this.table.querySelector('tbody'),
                insertBeforeReference = tbody.querySelectorAll('tr')[columnSortedBy.indexOf(insertedRowSortCell)];

            tbody.insertBefore(tableRow, insertBeforeReference);
        } else {
            console.error('invalid number of arguments to create new table row');
        }
    }
}

function sortAscending(a, b) {
    if (!isNaN(parseInt(a.dataset.cellData)) && !isNaN(parseInt(b.dataset.cellData))) {
        return a.dataset.cellData - b.dataset.cellData;
    } else {
        return a.dataset.cellData > b.dataset.cellData ? 1 : -1;
    }
}

function sortDescending(a, b) {
    if (!isNaN(parseInt(a.dataset.cellData)) && !isNaN(parseInt(b.dataset.cellData))) {
        return b.dataset.cellData - a.dataset.cellData;
    } else {
        return b.dataset.cellData > a.dataset.cellData ? 1 : -1;
    }
}

function styleCellData(data) {
    return !isNaN(parseInt(data)) ? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : data
}