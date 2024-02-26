export default function attackFeedback(props: {
  status: string;
  x: number;
  y: number;
  indexPlayer: number | string;
}) {
  const { status, x, y, indexPlayer } = props;

  return status !== ''
    ? JSON.stringify({
        type: 'attack',
        data: JSON.stringify({
          position: {
            x,
            y,
          },
          currentPlayer: indexPlayer,
          status,
        }),
        id: 0,
      })
    : null;
}
