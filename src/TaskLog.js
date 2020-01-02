import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Axios from 'axios';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import purple from '@material-ui/core/colors/purple';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import {MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import FormControl from '@material-ui/core/FormControl'
import Fab from '@material-ui/core/Fab'
import { withStyles } from '@material-ui/core/styles';

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(2.5),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    textField:{
        margin: theme.spacing(1),
        width: 200,
    },
    textFieldAutoSize:{
        margin: theme.spacing(1),
        width: 200,
    }
});

/**
 *
 * @param url
 * @param data
 * @param headers
 * @returns {Promise<AxiosResponse<any>>}
 * @Desc Generic async function for Post request
 */
async function POST(url, data, headers) {
    return await Axios({
        method: 'POST',
        url: url,
        data: data,
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        throw  new Error(error);
    });
}

/**
 * Function for perform pagination in data tables
 */
class TablePaginationActions extends React.Component {
    handleFirstPageButtonClick = event => {
        this.props.onChangePage(event, 0);
    };

    handleBackButtonClick = event => {
        this.props.onChangePage(event, this.props.page - 1);
    };

    handleNextButtonClick = event => {
        this.props.onChangePage(event, this.props.page + 1);
    };

    handleLastPageButtonClick = event => {
        this.props.onChangePage(
            event,
            Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
        );
    };

    render() {
        const { classes, count, page, rowsPerPage, theme } = this.props;

        return (
            <div className={classes.root}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="First Page"
                >
                    {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Previous Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                >
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </div>
        );
    }
}
const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
    TablePaginationActions,
);


export default class TaskLog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pendingTasks: [], completedTasks: [],
            propStyles: PropTypes.object.isRequired,
            openPopup: '',
            loaded:true, alertOpen:false,
            taskCompletedResponse:0,taskDeletedResponse:0,
            page_pending: 0, page_completed: 0, rowsPerPage_pending: 5, rowsPerPage_completed: 5,
            taskName:'',priority:0,status:'PENDING',description:''
        }

        this.getPendingTaskList();
        this.getCompletedTaskList();

    }
    /**
     * Get Pending Task List from back-end services
     **/
    getPendingTaskList(){
        var self = this;
        Axios.get('https://sleevsup-task-management.herokuapp.com/getPendingTasks')
            .then(function (response) {
                // handle success
                self.setState(preState => ({pendingTasks: response.data}))
                self.setState({loaded:false})
            })
            .catch(function (error) {
                self.setState({alertOpen:true})
                self.setState({loaded:false})
                console.log(error);
            })
    }

    /**
     * Function for Get completed Task List from back-end services
     **/
    getCompletedTaskList(){
        var self = this;
        Axios.get('https://sleevsup-task-management.herokuapp.com/getCompletedTasks')
            .then(function (response) {
                // handle success
                self.setState(preState => ({completedTasks: response.data}))
                self.setState({loaded:false})
            })
            .catch(function (error) {
                self.setState({alertOpen:true})
                self.setState({loaded:false})
                console.log(error);
            })
    }

    /**
     * Complete pending task function
     **/
    completeTask(taskId){
        var self = this;
        Axios.put('https://sleevsup-task-management.herokuapp.com/completeTask/'+taskId)
            .then(function (response) {
                // handle success
                self.setState(preState => ({taskCompletedResponse: response.data.responseCode}));
                self.setState({loaded:false})
                self.getPendingTaskList();
                self.getCompletedTaskList();
            })
            .catch(function (error) {
                self.setState({alertOpen:true})
                self.setState({loaded:false})
            })
    }

    /**
     * Delete Task function
     **/
    deleteTask(taskId){
        var self = this;
        Axios.delete('https://sleevsup-task-management.herokuapp.com/deleteTask/'+taskId)
            .then(function (response) {
                // handle success
                self.setState(preState => ({taskDeletedResponse: response.data.responseCode}));
                self.setState({loaded:false})
                self.getPendingTaskList();
            })
            .catch(function (error) {
                self.setState({alertOpen:true})
                self.setState({loaded:false})
            })
    }

    /**
     * Function for create new task
     **/

createTask(){
    var self = this;
    const data = {
        "taskName": self.state.taskName,
        "taskPriority": self.state.priority,
        "taskStatus": self.state.status,
        "description": self.state.description
    };
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    };


    let URL ='https://sleevsup-task-management.herokuapp.com/createTask';
    POST(URL, JSON.stringify(data), headers).then((result) => {
        this.setState({taskName:'',priority:0,description:''})
        self.getPendingTaskList();
        self.getCompletedTaskList();
    }).catch(err => {
        console.log('error', err)
    })
}
    handleInputChange = name => event => {
        this.setState({ [name]: event.target.value });
    };
    toggle() {
        this.setState({collapse: !this.state.collapse});
        this.connect(this.state.msisdn, this.state.deviceOs);
    }

    handleChangePage_pending = (event, page_pending) => {
        this.setState({ page_pending });
    };
    handleChangePage_completed = (event, page_completed) => {
        this.setState({ page_completed });
    };

    handleChangeRowsPerPage_pending = event => {
        this.setState({ page_pending: 0, rowsPerPage_pending: event.target.value });
    };

    handleChangeRowsPerPage_completed = event => {
        this.setState({ page_completed: 0, rowsPerPage_completed: event.target.value });
    };
    render() {
        const {rowsPerPage_pending,rowsPerPage_completed, page_pending,page_completed } = this.state;
        const theme = createMuiTheme({
            palette: {
                primary: purple,
            },
            typography: {
                useNextVariants: true,
            },
        });
        return (
            <form className={this.state.propStyles.container} noValidate autoComplete="off">
                <div>
                    <AppBar position="static" style={{color:"#242424"}}>
                        <Toolbar>
                            <Grid container justify="center" alignItems="center" style={{width:215}}>
                                <img src={"../img/logo/logo.png"} style={{height:"40px", marginLeft: -12,marginRight: 20}}/>
                            </Grid>
                            <Typography variant="h6" color="inherit" style={{flexGrow: 1}}></Typography>
                            <Grid container justify="center" alignItems="center" style={{width:"130px"}}>
                                <Avatar alt="RR"  src="../img/avatar/avatar.png" className={this.state.propStyles.bigAvatar} />
                            </Grid>
                        </Toolbar>
                    </AppBar>
                </div>
                <div className="col-md-12" >
                    <TextField  id="standard-name" label="Title" value={this.state.taskName} style={{marginRight:"100px"}}
                        onChange={this.handleInputChange('taskName').bind(this)} margin="normal"/>
                    <FormControl style={{width:"140px",marginRight:"100px",marginTop:"16px"}}>
                        <InputLabel id="demo-simple-select-label">Age</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={this.state.priority}
                            onChange={this.handleInputChange('priority').bind(this)}
                        >
                            <MenuItem value={0}>High</MenuItem>
                            <MenuItem value={1}>Medium</MenuItem>
                            <MenuItem value={2}>Low</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField  id="standard-name" label="Status"  style={{marginRight:"100px"}} defaultValue='Pending'
                                InputProps={{
                                    readOnly: true,
                                }}
                                 margin="normal"/>
                    <TextareaAutosize value={this.state.description} aria-label="empty textarea" placeholder="Empty" style={{marginRight:"100px",marginTop:"16px",width:"550px",height:"60px"}}
                                      onChange={this.handleInputChange('description').bind(this)}/>
                    <Button variant="contained" color="secondary"  className={this.state.propStyles.button} style={{width: 150,marginTop:25}}
                            onClick={()=>this.createTask()}>
                        Add Task
                    </Button>
                </div>

                {this.state.loaded?(
                    <div><LinearProgress
                        classes={{
                            colorPrimary: "this.state.propStyles.linearColorPrimary",
                            barColorPrimary: this.state.propStyles.linearBarColorPrimary,
                        }}
                    /></div>
                ):null}
                <Paper className={this.state.propStyles.root}>
                    <span>Pending Tasks</span>
                    <Table className={this.state.propStyles.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">#</TableCell>
                                <TableCell align="center">Task Name</TableCell>
                                <TableCell align="center">Priority Level</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">#</TableCell>
                                <TableCell align="center">#</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.pendingTasks.map !== undefined ? this.state.pendingTasks.slice(page_pending * rowsPerPage_pending, page_pending * rowsPerPage_pending + rowsPerPage_pending).map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">{row.id}</TableCell>
                                        <TableCell align="center">{row.taskName}</TableCell>
                                        <TableCell align="center">{row.priorityLevel===0?
                                        (
                                            <div>High</div>
                                        ):<div>
                                                {row.priorityLevel===1?
                                                    (
                                                        <div>Medium</div>
                                                    ):<div>Low</div>
                                                }
                                            </div>
                                        }
                                            </TableCell>
                                        <TableCell align="center">{row.status===0?
                                            (
                                                <div>Pending</div>
                                            ):<div>
                                                Completed
                                            </div>
                                        }
                                        </TableCell>
                                        <TableCell align="center">{row.description}</TableCell>
                                        <TableCell align="center">
                                            <MuiThemeProvider theme={theme}>
                                                <Fab style={{width:"100%"}}  variant="contained"  color="primary"
                                                        onClick={()=>this.completeTask(row.id)}
                                                        className={(this.state.propStyles.margin, this.state.propStyles.cssRoot)}>
                                                    Complete
                                                </Fab>

                                            </MuiThemeProvider>
                                        </TableCell>
                                        <TableCell>
                                            <MuiThemeProvider theme={theme}>
                                                <Fab style={{width:"100%"}} variant="contained"  color="secondary" className={(this.state.propStyles.margin, this.state.propStyles.cssRoot)}
                                                        onClick={()=>this.deleteTask(row.id)} >Delete</Fab>
                                            </MuiThemeProvider>
                                        </TableCell>
                                    </TableRow>
                            )) :null
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    colSpan={3}
                                    count={this.state.pendingTasks.length}
                                    rowsPerPage={rowsPerPage_pending}
                                    page={page_pending}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    onChangePage={this.handleChangePage_pending}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage_pending}
                                    ActionsComponent={TablePaginationActionsWrapped}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>

                    <span>Completed Tasks</span>
                    <Table  className={this.state.propStyles.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">#</TableCell>
                                <TableCell align="center">Task Name</TableCell>
                                <TableCell align="center">Priority Level</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.completedTasks.map !== undefined ? this.state.completedTasks.slice(page_completed * rowsPerPage_completed, page_completed * rowsPerPage_completed + rowsPerPage_completed).map(row => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">{row.id}</TableCell>
                                    <TableCell component="th" align="center" scope="row">{row.taskName}</TableCell>
                                    <TableCell align="center">{row.priorityLevel===0?
                                        (
                                            <div>High</div>
                                        ):<div>
                                            {row.priorityLevel===1?
                                                (
                                                    <div>Medium</div>
                                                ):<div>Low</div>
                                            }
                                        </div>
                                    }
                                    </TableCell>
                                    <TableCell align="center">{row.status===0?
                                        (
                                            <div>Pending</div>
                                        ):<div>
                                           Completed
                                        </div>
                                    }
                                    </TableCell>
                                    <TableCell align="center">{row.description}</TableCell>
                                </TableRow>
                            )) :null
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    colSpan={3}
                                    count={this.state.completedTasks.length}
                                    rowsPerPage={rowsPerPage_completed}
                                    page={page_completed}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    onChangePage={this.handleChangePage_completed}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage_completed}
                                    ActionsComponent={TablePaginationActionsWrapped}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Paper>
            </form>

        );
    }

}
