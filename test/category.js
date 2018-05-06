/*

testing for

getCategories
createCategory

createCategories
updateCategory
checkDefault

deleteCategory
deleteProfileCategory

when creating transaction and select flag then must select the right bill drop down

when updating transaction from no flag to yes flag then must select the right bill

router.post('/create/1/:pid', controller.createTransaction, controller.addTransactionToBill);
router.put('/update/:pid/:id', controller.updateTransactionById, controller.addTransactionToBill);

either case must call next if flag = yes

*/

