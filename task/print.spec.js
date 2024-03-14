/* eslint-disable indent */
const assert = require('assert');
const os = require('os');

const Print = require('./print');
const DataSet = require('./thirdparty/data-set');

describe('Print', () => {
    const view = {
        data: '',
        write: text => view.data = text,
        read: () => view.data,
    };
    const manager = {
        tableData: new Map(),
        getTableData: tableName => manager.tableData.get(tableName) || [],
    };
    let command = null;

    beforeEach(() => {
        view.data = '';
        manager.tableData = new Map();
        command = new Print(view, manager);
    });

    describe('process', () => {
        it('should print table with multi data sets', () => {
            manager.tableData.set('users', [
                new DataSet([['id', 1], ['name', 'Steven Seagal'], ['password', '123456']]),
                new DataSet([['id', 2], ['name', 'Eva Song'], ['password', '789456']]),
            ]);
            const expected = [
                '╔════════════════╦════════════════╦════════════════╗',
                '║       id       ║      name      ║    password    ║',
                '╠════════════════╬════════════════╬════════════════╣',
                '║       1        ║ Steven Seagal  ║     123456     ║',
                '╠════════════════╬════════════════╬════════════════╣',
                '║       2        ║    Eva Song    ║     789456     ║',
                '╚════════════════╩════════════════╩════════════════╝',
                '',
            ].join(os.EOL);
            command.process('print users');
            assert.strictEqual(view.read(), expected);
        });
    });

    describe('canProcess', () => {
        it('should trow exception when command is wrong', () => {
            assert.throws(() => {
                command.process('print');
            });
        });

        it('should process valid command', () => {
            assert.strictEqual(command.canProcess('print test'), true);
        });

        it('should not process invalid command', () => {
            assert.strictEqual(command.canProcess('qwe'), false);
        });
    });
});
