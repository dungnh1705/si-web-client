import { Grid, Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'

import { changeOptionEnum } from 'app/enums'
import { TypeSelected, StudentSelected} from '../recoil'

export default function HeaderAction() {
    const setTypeSelected = useSetRecoilState(TypeSelected)
    const setStudentSelected = useSetRecoilState(StudentSelected)
    
    useEffect(() => {
        setTypeSelected(changeOptionEnum.Union)
    }, [])

    const [activeButton, setActiveButton] = useState('Union')

    const handleClickTeamOption = (e) => {
        setTypeSelected(changeOptionEnum.Team)
        setActiveButton('Team')
        setStudentSelected([])
    }

    const handleClickUnionOption = (e) => {
        setTypeSelected(changeOptionEnum.Union)
        setActiveButton('Union')
        setStudentSelected([])
    }

    return (
        <Grid item container spacing={1} justifyContent='center' alignItems='center'>
            <Grid item xs={5} sm={3} lg={2} container justifyContent="center" alignItems="center">
                <Button
                    variant='contained'
                    onClick={handleClickUnionOption}
                    color={activeButton === 'Union' ? 'primary' : 'default'}
                    style={{ whiteSpace: 'nowrap' }}>
                    Chuyển chi đoàn
                </Button>
            </Grid>
            <Grid item xs={5} sm={3} lg={1} container justifyContent="center" alignItems="center">
                <Button
                    variant='contained' onClick={handleClickTeamOption}
                    color={activeButton === 'Team' ? 'primary' : 'default'}
                    style={{ whiteSpace: 'nowrap' }}>
                    Chuyển đội
                </Button>
            </Grid>
        </Grid>
    )

}