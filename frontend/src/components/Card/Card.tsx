import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

interface OutlinedCardProps {
    label: string;
    content: string | React.ReactNode;
}

const Cards = ({ label, content }: OutlinedCardProps) => {
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" component="div">
                        {label}
                    </Typography>
                    <Typography variant="body2">
                        {content}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Cards;