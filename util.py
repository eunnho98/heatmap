import pandas as pd
from pandas import DataFrame


def getPoint(x_cut, y_cut, z_cut, dataf: DataFrame):
    if x_cut * y_cut * z_cut > 1000:
        raise Exception("Over 1000")

    df = dataf.copy()
    df["x_qcut"] = pd.qcut(df["x_rad"], q=x_cut)
    df["y_qcut"] = pd.qcut(df["y_rad"], q=y_cut)
    df["z_qcut"] = pd.qcut(df["z_rad"], q=z_cut)

    return df


def getDots(dataf: DataFrame, x_rad: float, y_rad: float, z_rad: float):
    df = dataf.copy()
    x_intervals = df["x_qcut"].cat.categories
    y_intervals = df["y_qcut"].cat.categories
    z_intervals = df["z_qcut"].cat.categories

    try:
        x_idx = x_intervals.get_loc(x_rad)
        y_idx = y_intervals.get_loc(y_rad)
        z_idx = z_intervals.get_loc(z_rad)
        x_cat, y_cat, z_cat = x_intervals[x_idx], y_intervals[y_idx], z_intervals[z_idx]
    except KeyError as e:
        return -1

    df = df.set_index(["x_qcut", "y_qcut", "z_qcut"]).sort_index(
        level=["x_qcut", "y_qcut", "z_qcut"]
    )
    try:
        result: DataFrame = df.loc[x_cat, y_cat, z_cat][["x", "y", "row", "col"]]
        result = result.reset_index().drop(["x_qcut", "y_qcut", "z_qcut"], axis=1)
        return result.to_dict()

    except KeyError as e:
        return -1
