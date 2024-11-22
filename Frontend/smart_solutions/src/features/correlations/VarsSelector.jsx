import { useState, useEffect } from 'react';
import { Box, Typography, Checkbox } from '@mui/material';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CorrelationsApi from './CorrelationApi';

// TODO remember selected vars.
export default function VarSelector( {selectedVars, setSelectedVars} ) {
	const [varsData, setVarsData] = useState(() => {
		const savedVars = localStorage.getItem('vars');
		return savedVars !== null ? JSON.parse(savedVars) : null;
	});
	const [collapsedGroups, setCollapsedGroups] = useState({});
    
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        async function loadData() {		
			if (varsData === null) {
				const vars = await CorrelationsApi.getVarsData(signal);                                
				if (vars !== undefined) {
						localStorage.setItem('vars', JSON.stringify(vars));
				}
				setVarsData(vars);
			}            
        };
        loadData(signal);
        return () => abortController.abort();
    }, []);

    function onSelectedVars(vars) {
        setSelectedVars(vars);
    }

	const handleToggle = (group, value) => () => {
		const currentSelection = selectedVars[group] || [];
		const currentIndex = currentSelection.indexOf(value);
		const newSelection = [...currentSelection];
	
		if (currentIndex === -1) {
		  newSelection.push(value);
		} else {
		  newSelection.splice(currentIndex, 1);
		}

		setSelectedVars({
		  ...selectedVars,
		  [group]: newSelection,
		});
	
		const allSelected = {
			...selectedVars,
			[group]: newSelection,
		}
		onSelectedVars(allSelected);
	};

	const handleMasterToggle = (group) => () => {
		const currentSelection = selectedVars[group] || [];
		const groupValues = varsData[group];
		const newSelection =
		currentSelection.length === groupValues.length
			? [] // If all items are selected, deselect all
			: groupValues; // If some or none are selected, select all

		setSelectedVars({
		...selectedVars,
		[group]: newSelection,
		});
		
		const allSelected = {
			...selectedVars,
			[group]: newSelection,
		}
		onSelectedVars(allSelected);
	};

	const isGroupIndeterminate = (group) => {
		const currentSelection = selectedVars[group] || [];
		return currentSelection.length > 0 && currentSelection.length < varsData[group].length;
	};

	const handleGroupToggle = (group) => {
		setCollapsedGroups({
			...collapsedGroups,
			[group]: !collapsedGroups[group],
		});
	};

	  if (varsData == null) {
		return (<></>)
	  };

	return (
		<Box sx={{
			flex: '1 1 auto',
			overflow:'auto',
			height: '100%',
		}}>		
			<List sx={{height:'auto', width: '100%', bgcolor: 'background.paper'}} subheader={<ListSubheader component="span" id="nested-list-subheader">Variables</ListSubheader>}>
			{Object.keys(varsData).map((group) => (
				<div key={group}>
					<ListItem key={group} disablePadding
						secondaryAction={
							<Checkbox
								edge="start"
								indeterminate={isGroupIndeterminate(group)}
								onChange={handleMasterToggle(group)}
								checked={selectedVars[group]?.length === varsData[group].length}
								tabIndex={-1}
								disableRipple /> 
						}>
						<ListItemButton onClick={() => handleGroupToggle(group)}>
							{collapsedGroups[group] ? <ExpandLess /> : <ExpandMore />}
							<ListItemText id="2" primary={group} />
							</ListItemButton>
					</ListItem>
					<Collapse in={collapsedGroups[group]} timeout="auto" unmountOnExit>
					<List disablePadding>
						{varsData[group].map((value) => (
						<ListItem key={value} disablePadding>
							<ListItemButton role={undefined} onClick={handleToggle(group, value)}>
							<Checkbox checked={(selectedVars[group] || []).includes(value)} />
							<Typography variant="body1">{value}</Typography>
							</ListItemButton>
						</ListItem>
						))}
					</List>
					</Collapse>
				</div>
				))}
			</List>
		</Box>
	)
}