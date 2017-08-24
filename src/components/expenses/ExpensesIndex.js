import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Pagination from 'react-bootstrap/lib/Pagination';
import objectAssign from 'object-assign';

import ExpenseRow from './ExpenseRow';
import ExpenseFilters from './ExpenseFilters';
import ExpenseModal from './ExpenseModal';
import ExpenseTable from './ExpenseTable';

class ExpensesIndex extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.props.actions.getCurrencies();
    this.props.actions.getExpenses(props.expenses.filters);
    this.props.actions.getExpenseTypes({ hasChildren: false });
    this.props.actions.getVendors();
    this.props.actions.getPaymentTypes();
    this.props.actions.getCards();

    this.onExpenseAdd = this.onExpenseAdd.bind(this);
    this.onExpenseAddAnother = this.onExpenseAddAnother.bind(this);
    this.onExpenseChanged = this.onExpenseChanged.bind(this);
    this.onFiltersChanged = this.onFiltersChanged.bind(this);
  }

  onExpenseAdd(){
    this.props.actions.addExpense(this.props.expenses.expense, this.props.expenses.filters);
  }

  onExpenseAddAnother(){
    this.props.actions.addExpenseAnother(this.props.expenses.expense, this.props.expenses.filters);
  }

  onExpenseChanged(expenseValue){
    let expense = objectAssign({}, this.props.expenses.expense, expenseValue);
    this.props.actions.changedExpense(expense);
  }

  onFiltersChanged(filterValue){
    let filters = objectAssign({}, this.props.expenses.filters, filterValue);
    
    if(filterValue.page == undefined){
      filters.page = 1;
    }
    
    this.props.actions.changedFilters(filters);
  }

  render() {

    const expenses = this.props.expenses.expenses.items.map(function(expense){
      return <ExpenseRow key={expense.valueId} expense={expense}/>;
    });

    return (
      <Grid>
        <Row>
          <Col lg={3}>
            <Panel header="Filters">
              <ExpenseFilters currencies={this.props.registers.currencies}
                              expenseTypes={this.props.registers.expenseTypes}
                              vendors={this.props.registers.vendors}
                              onChange={this.onFiltersChanged} />
            </Panel>
          </Col>
          <Col lg={9}>
            <Row>
              <Col lg={12}>
                <Panel header="Expenses">
                    <Row>
                      <Col lg={12}>
                        <Button onClick={this.props.actions.openModal}>New</Button>                  
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <ExpenseTable>
                          {expenses}
                        </ExpenseTable>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <Pagination prev next first last ellipsis boundaryLinks items={Math.ceil(this.props.expenses.expenses.count / this.props.expenses.filters.pageSize)}
                                                                                maxButtons={5}
                                                                                activePage={this.props.expenses.filters.page}
                                                                                onSelect={page => this.onFiltersChanged({page: page})} />
                      </Col>
                    </Row>
                </Panel>
              </Col>
            </Row>
          </Col>
        </Row>
        <ExpenseModal currencies={this.props.registers.currencies}
                      expenseTypes={this.props.registers.expenseTypes}
                      vendors={this.props.registers.vendors}
                      vendorPois={this.props.expenses.vendorPois}
                      cards={this.props.expenses.cards}
                      paymentTypes={this.props.registers.paymentTypes}
                      expense={this.props.expenses.expense}
                      isOpen={this.props.expenses.isModalOpen}
                      onExpenseAdd={this.onExpenseAdd}
                      onExpenseAddAnother={this.onExpenseAddAnother}
                      onVendorChanged={this.props.actions.onVendorChanged}
                      onClose={this.props.actions.closeModal}
                      onChange={this.onExpenseChanged} />
      </Grid>
    );
  }
}

export default ExpensesIndex;

ExpensesIndex.propTypes = {
  actions: React.PropTypes.object,
  expenses: React.PropTypes.object,
  registers: React.PropTypes.object
};