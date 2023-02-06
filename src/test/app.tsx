import { usePreloadedReplicant } from '@/lib/hooks/usePreloadedReplicant';
import { FormattedDonation, Total } from '@/types/tracker';
import { Button, MenuItem, Select } from '@mui/material';
import { channels } from '..';
import { BreakChannels } from './preview';

const totalRep = nodecg.Replicant<Total>('total', {
	defaultValue: {
		raw: 0,
		formatted: '$0',
	},
});

export function App() {
	const [breakChannel, setBreakChannel] = usePreloadedReplicant<number>('break-channel', 0);

	return (
		<>
			<BreakChannels />
			<div>
				<Select value={breakChannel} onChange={(e) => setBreakChannel(e.target.value as number)}>
					{channels.map((channel, idx) => (
						<MenuItem key={idx} value={idx}>
							{channel.name}
						</MenuItem>
					))}
				</Select>
				<Button
					onClick={() => {
						const amount = Math.floor(Math.random() * 20000) / 100;
						const newTotal = Math.floor((totalRep.value!.raw + amount) * 100) / 100;

						nodecg.sendMessage('donation', {
							amount: formatCurrency(amount, 2),
							rawAmount: amount,
							newTotal: formatCurrency(newTotal),
							rawNewTotal: newTotal,
						} as FormattedDonation);

						totalRep.value = {
							raw: newTotal,
							formatted: formatCurrency(newTotal),
						};
					}}
					variant="contained">
					Test Donation
				</Button>
				<Button
					variant="contained"
					onClick={() => setBreakChannel((breakChannel + channels.length - 1) % channels.length)}>
					Previous
				</Button>
				<Button variant="contained" onClick={() => setBreakChannel((breakChannel! + 1) % channels.length)}>
					Next
				</Button>
			</div>
		</>
	);
}

function formatCurrency(amount: number, fractionDigits?: number) {
	return amount.toLocaleString('en-US', {
		maximumFractionDigits: fractionDigits,
		minimumFractionDigits: fractionDigits,
		style: 'currency',
		currency: 'USD',
	});
}