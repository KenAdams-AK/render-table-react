export default function LoadingFallback() {
	const COLUMNS_AMOUNT = new Array(8).fill("");
	const ROWS_AMOUNT = new Array(10).fill("");
	return (
		<tbody className="TableBody">
			{ROWS_AMOUNT.map((item, index) => (
				<tr key={index} className="TableBody__row">
					<th>
						<div className="skeleton"></div>
					</th>
					{COLUMNS_AMOUNT.map((item, index) => (
						<td key={index}>
							<div className="skeleton"></div>
							<div className="skeleton"></div>
						</td>
					))}
				</tr>
			))}
		</tbody>
	);
}
