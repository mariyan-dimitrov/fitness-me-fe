import styled, { useTheme } from "styled-components/macro";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import useTranslate from "../hooks/useTranslate";

const sortyByDate = (a, b) => {
  const [aDate] = a;
  const [bDate] = b;

  return aDate - bDate;
};

const WeightChart = ({ weightRecords }) => {
  const i18n = useTranslate();
  const theme = useTheme();

  const chartData =
    weightRecords &&
    weightRecords.map(({ mass, day }) => [new Date(day).getTime(), mass]).sort(sortyByDate);

  if (!weightRecords) {
    return null;
  }

  const options = {
    title: {
      text: i18n("WEIGHT_PAGE.WEIGHT_PROGRESS"),
      style: {
        color: theme.palette.text.primary,
      },
    },
    chart: {
      backgroundColor: "transparent",
    },
    tooltip: {
      backgroundColor: `${theme.palette.background.default}`,
      style: {
        color: theme.palette.text.primary,
      },
    },
    legend: {
      itemStyle: {
        color: theme.palette.text.primary,
      },
    },
    plotOptions: {
      series: {
        color: theme.palette.primary.light,
      },
    },
    navigator: {
      xAxis: {
        lineColor: theme.palette.text.primary,
        gridLineColor: theme.palette.text.primary,
        labels: {
          style: {
            color: theme.palette.text.primary,
          },
        },
      },
    },
    xAxis: [
      {
        type: "datetime",
        dateTimeLabelFormats: {
          day: "%d %b %Y",
        },
        title: {
          text: i18n("WEIGHT_PAGE.DATE"),
          style: {
            color: theme.palette.text.primary,
          },
        },
        gridLineColor: "transparent",
        lineColor: theme.palette.text.primary,
        crosshair: {
          color: theme.palette.text.primary,
          dashStyle: "LongDash",
          label: {
            backgroundColor: theme.palette.text.primary,
            padding: 5,
          },
        },
        labels: {
          style: {
            color: theme.palette.text.primary,
          },
        },
      },
    ],

    yAxis: [
      {
        title: {
          text: i18n("WEIGHT_PAGE.WEIGHT"),
          style: {
            color: theme.palette.text.primary,
          },
        },
        crosshair: {
          color: theme.palette.text.primary,
          dashStyle: "LongDash",
          label: {
            backgroundColor: theme.palette.text.primary,
            padding: 5,
          },
        },
        labels: {
          style: {
            color: theme.palette.text.primary,
          },
        },
      },
    ],
    series: [
      {
        data: chartData,
      },
    ],
  };

  return (
    <Wrap>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Wrap>
  );
};

export default WeightChart;

const Wrap = styled.div`
  .highcharts-credits {
    display: none !important;
  }
`;
