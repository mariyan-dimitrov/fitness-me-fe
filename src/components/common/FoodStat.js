import styled, { useTheme } from "styled-components/macro";

import Tooltip from "./Tooltip";

const FoodStat = ({ carbs = 0, protein = 0, fats = 0 }) => {
  const theme = useTheme();
  const entities = {
    protein,
    carbs,
    fats,
  };

  const colors = {
    protein: theme.palette.secondary.light,
    carbs: theme.palette.primary.light,
    fats: theme.palette.success.light,
  };

  const total = Object.values(entities).reduce((a, b) => Number(a) + Number(b));

  return (
    <Wrap>
      {Object.keys(entities).map(key => {
        const width = (entities[key] / total) * 100;

        if (!width) {
          return null;
        }

        return (
          <EntityWrap styledwidth={isNaN(width) ? 0 : width} styledcolor={colors[key]} key={key}>
            <Tooltip tooltipText={key}>
              <EntityPlaceholder />
            </Tooltip>
          </EntityWrap>
        );
      })}
    </Wrap>
  );
};

export default FoodStat;

const Wrap = styled.div`
  width: 100%;
  height: 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
`;

const EntityWrap = styled.div`
  height: 20px;
  width: ${({ styledwidth }) => styledwidth}%;
  background-color: ${({ styledcolor }) => styledcolor};

  &:first-child {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  &:last-child {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  &:hover {
    box-shadow: 0px 0px 15px 0px ${({ styledcolor }) => styledcolor};
  }
`;

const EntityPlaceholder = styled.div`
  height: 20px;
  width: ${({ styledwidth }) => styledwidth}%;
`;
